import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase"; // Подключаем нашу базу данных

export async function POST(req) {
  try {
    const { text, type } = await req.json();

    if (!text || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) {
      return NextResponse.json({ error: "Yandex Cloud credentials are missing" }, { status: 500 });
    }

    // Формируем системный промпт в зависимости от выбранного режима
    const systemPrompt = type === "dream"
      ? "Ты — опытный юнгианский психоаналитик и толкователь снов. Разбери ночное видение пользователя. Найди скрытые архетипы, символы Тени, Анимы или Анимуса. Твой ответ должен быть глубоким, мистическим, но терапевтическим. Используй разметку Markdown: разделяй текст на логические blocks с помощью заголовков '## ' и выделяй ключевые инсайты жирным шрифтом '**'."
      : "Ты — Децентрализованный Оракул Таро и мастер ментальной алхимии. Сделай виртуальный расклад по запросу пользователя. Опиши выпавшие карты, их тайный смысл и влияние на текущее ментальное поле. Дай четкое руководство к действию. Используй разметку Markdown: разделяй текст на логические blocks с помощью заголовков '## ' и выделяй ключевые инсайты жирным шрифтом '**'.";

    // Делаем запрос к Yandex GPT API
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

    // 🔥 Автоматически сохраняем лог запроса в базу данных Supabase
    const { error: dbError } = await supabase
      .from("shadow_history")
      .insert([
        {
          type: type,
          input_text: text,
          ai_response: aiResult
        }
      ]);

    if (dbError) {
      console.error("Supabase saving error:", dbError.message);
      // Если упала только база, мы не ломаем приложение для юзера, но пишем лог ошибки в консоль
    }

    // Возвращаем результат на фронтенд
    return NextResponse.json({ result: aiResult });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}