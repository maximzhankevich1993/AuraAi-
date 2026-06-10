import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const { text, type, sessionId } = await req.json();

    if (!text || !type || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) {
      return NextResponse.json({ error: "Yandex Cloud credentials are missing" }, { status: 500 });
    }

    // --- QUANTUM LIMITS CHECK ---
    let { data: balanceData, error: balanceError } = await supabase
      .from("user_balances")
      .select("credits_left")
      .eq("session_id", sessionId)
      .single();

    if (!balanceData) {
      const { data: newBalance, error: createError } = await supabase
        .from("user_balances")
        .insert([{ session_id: sessionId, credits_left: 3 }])
        .select("credits_left")
        .single();
      
      if (createError) {
        console.error("Database error:", createError.message);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      balanceData = newBalance;
    }

    if (balanceData.credits_left <= 0) {
      return NextResponse.json(
        { error: "OUT_OF_CREDITS", message: "Subconscious energy depleted. Recharge required." },
        { status: 403 }
      );
    }

    // --- ENGLISH MYSTICAL PROMPTS ---
    const systemPrompt = type === "dream"
      ? "You are an expert Jungian psychoanalyst and dream interpreter. Analyze the user's dream. Identify hidden archetypes, Shadow symbols, Anima or Animus. Your response must be deep, mystical, yet therapeutic. Use Markdown layout: separate text into logical blocks using '## ' headers and bold key insights with '**'."
      : "You are a Decentralized Tarot Oracle and master of mental alchemy. Perform a virtual spread based on the user's query. Describe the drawn cards, their hidden meaning, and their influence on the current mental field. Provide clear actionable guidance. Use Markdown layout: separate text into logical blocks using '## ' headers and bold key insights with '**'.";

    const yandexResponse = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`
      },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
        completionOptions: { stream: false, temperature: 0.7, maxTokens: 2000 },
        messages: [
          { role: "system", text: systemPrompt },
          { role: "user", text: `User request: ${text}` }
        ]
      })
    });

    const yandexData = await yandexResponse.json();
    const aiResult = yandexData.result?.alternatives?.[0]?.message?.text;

    if (!aiResult) {
      return NextResponse.json({ error: "Failed to get response from AI Oracle" }, { status: 500 });
    }

    // --- UPDATE CREDITS & LOGS ---
    await supabase
      .from("user_balances")
      .update({ credits_left: balanceData.credits_left - 1 })
      .eq("session_id", sessionId);

    await supabase
      .from("shadow_history")
      .insert([{ type, input_text: text, ai_response: aiResult, session_id: sessionId }]);

    return NextResponse.json({ result: aiResult });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}