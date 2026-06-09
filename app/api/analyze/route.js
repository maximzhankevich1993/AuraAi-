import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, type } = await req.json(); // type: 'dream' (анализ сна) или 'tarot' (расклад)

    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) {
      return NextResponse.json(
        { error: "ИИ-конфигурация не настроена на сервере" },
        { status: 500 }
      );
    }

    // Системная инструкция, формирующая характер Оракула
    const systemPrompt = `Ты — AuraAI, цифровой преемник Карла Густава Юнга и децентрализованный ИИ-архетипист.
Ты проводишь глубокий, метафорический и строгий анализ человеческого бессознательного.
Говори как интеллектуал, мистик и психоаналитик одновременно. Используй термины: Архетип, Тень, Анима, Самость, Индивидуация.
Избегай банальных и позитивных фраз вроде "все будет хорошо". Будь точен, немного холоден, но неси свет осознания.

СТРУКТУРА ОТВЕТА (всегда форматируй строго в Markdown):
## 🌌 Деконструкция Символов
(Разбор ключевых образов и скрытых метафор)

## 👤 Встреча с Тенью
(Какие подавленные мотивы, страхи или вытесненные желания прячет подсознание)

## 🧭 Вектор Индивидуации
(Глубокое руководство: как интегрировать этот опыт в реальную жизнь и стать целостным)`;

    // Отправляем запрос в Yandex Cloud
    const response = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`,
        "x-folder-id": folderId,
      },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt/latest`,
        completionOptions: {
          stream: false,
          temperature: 0.6,
          maxTokens: "2000",
        },
        messages: [
          { role: "system", text: systemPrompt },
          { role: "user", text: `Тип практики: ${type === 'tarot' ? 'Расклад Таро' : 'Анализ сновидения'}. Входные данные от пользователя: ${text}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Yandex API Error:", errorData);
      return NextResponse.json({ error: "Ошибка при запросе к Yandex GPT" }, { status: 500 });
    }

    const data = await response.json();
    
    // Вытаскиваем чистый сгенерированный текст из ответа Яндекса
    const aiResult = data.result.alternatives[0].message.text;

    return NextResponse.json({ result: aiResult });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}