import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    // Принимаем текст запроса, тип (dream/tarot) и анонимный ID сессии с фронтенда
    const { text, type, sessionId } = await req.json();

    if (!text || !type || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) {
      return NextResponse.json({ error: "Yandex Cloud credentials are missing" }, { status: 500 });
    }

    // ==========================================
    // 🛡️ БЛОК ПРОВЕРКИ И КОНТРОЛЯ ЛИМИТОВ (PAYWALL)
    // ==========================================
    
    // 1. Запрашиваем баланс текущей сессии в Supabase
    let { data: balanceData, error: balanceError } = await supabase
      .from("user_balances")
      .select("credits_left")
      .eq("session_id", sessionId)
      .single();

    // 2. Если пользователя с такой сессией еще нет — регистрируем его и даем 3 бесплатные попытки
    if (!balanceData) {
      const { data: newBalance, error: createError } = await supabase
        .from("user_balances")
        .insert([{ session_id: sessionId, credits_left: 3 }])
        .select("credits_left")
        .single();
      
      if (createError) {
        console.error("Error creating user balance:", createError.message);
        return NextResponse.json({ error: "Database error during registration" }, { status: 500 });
      }
      balanceData = newBalance;
    }

    // 3. Если кредиты на нуле — рубим запрос и не тратим деньги на Yandex GPT
    if (balanceData.credits_left <= 0) {
      return NextResponse.json(
        { error: "OUT_OF_CREDITS", message: "Энергия подсознания исчерпана. Требуется подзарядка." },
        { status: 403 }
      );
    }

    // ==========================================
    // 🧠 ВЗАИМОДЕЙСТВИЕ С ИИ LAYER (YANDEX GPT)
    // ==========================================

    const systemPrompt = type === "dream"
      ? "Ты — опытный юнгианский психоаналитик и толкователь снов. Разбери ночное видение пользователя. Найди скрытые архетипы, символы Тени, Анимы или Анимуса. Твой ответ должен быть глубоким, мистическим, но терапевтическим. Используй разметку Markdown: разделяй текст на логические блоки с помощью заголовков '## ' и выделяй ключевые инсайты жирным шрифтом '**'."
      : "Ты — Децентрализованный Оракул Таро и мастер ментальной алхимии. Сделай виртуальный расклад по запросу пользователя. Опиши выпавшие карты, их тайный смысл и влияние на текущее ментальное поле. Дай четкое руководство к действию. Используй разметку Markdown: разделяй текст на логические блоки с помощью заголовков '## ' и выделяй ключевые инсайты жирным шрифтом '**'.";

    const yandexResponse = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`
      },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
        completionOptions: { 
          stream: false, 
          temperature: 0.7, 
          maxTokens: 2000 
        },
        messages: [
          { role: "system", text: systemPrompt },
          { role: "user", text: `Мой запрос: ${text}` }
        ]
      })
    });

    const yandexData = await yandexResponse.json();
    const aiResult = yandexData.result?.alternatives?.[0]?.message?.text;

    if (!aiResult) {
      return NextResponse.json({ error: "Failed to get response from AI Oracle" }, { status: 500 });
    }

    // ==========================================
    // 💾 СОХРАНЕНИЕ ДАННЫХ И СПИСАНИЕ БАЛАНСА
    // ==========================================

    // Списываем ровно 1 кредит за успешную генерацию
    const { error: updateError } = await supabase
      .from("user_balances")
      .update({ credits_left: balanceData.credits_left - 1 })
      .eq("session_id", sessionId);

    if (updateError) {
      console.error("Error updating credits:", updateError.message);
    }

    // Записываем лог предсказания в архив shadow_history
    const { error: dbError } = await supabase
      .from("shadow_history")
      .insert([
        {
          type: type,
          input_text: text,
          ai_response: aiResult,
          session_id: sessionId
        }
      ]);

    if (dbError) {
      console.error("Supabase log saving error:", dbError.message);
      // Ошибку логируем, но юзеру ответ отдаем, чтобы не ломать UX из-за сбоя логов
    }

    // Отправляем готовый ответ на фронтенд
    return NextResponse.json({ result: aiResult });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}