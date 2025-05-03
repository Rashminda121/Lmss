import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

const ROLE_PROMPTS: Record<string, string> = {
  general:
    "You are a helpful AI assistant. Provide clear and concise answers to the user's questions. " +
    "Keep responses under 100 words. Be direct and factual.",

  education:
    "You are an educational assistant. Explain concepts clearly with examples, and encourage learning. " +
    "Break down complex topics into simpler parts. Teach students in 3 sentences max. Focus on key principles.",

  "mental-support":
    "You are a compassionate mental health supporter. Provide empathetic responses, active listening, and gentle guidance. " +
    "Never give medical advice. Respond in 1-2 supportive sentences.",

  coding:
    "You are a senior software engineer. Provide clean, efficient code solutions with explanations. " +
    "Consider best practices and performance. Default to code-only answers unless asked for details.",

  creative:
    "You are a creative writer. Help with storytelling, brainstorming, and artistic ideas. " +
    "Be imaginative and expressive. Respond in 1-2 lines to quickly inspire ideas.",

  career:
    "You are a career coach. Offer clear, practical advice on resumes, interviews, and professional growth. " +
    "Focus on actionable tips and confident communication. Be concise unless detailed guidance is requested.",
};

export async function POST(req: NextRequest) {
  try {
    const { messages, role = "general" } = await req.json();

    const systemPrompt =
      `${ROLE_PROMPTS[role]}\n\nImportant: Keep all responses under 100 words.` ||
      ROLE_PROMPTS.general;

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error:", error);

    // Proper error type checking
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }

    // Fallback for non-Error types
    return NextResponse.json(
      { error: "Internal server error", details: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
