import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Edge runtime
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content:
          "You are the Last Codebender, a unique individual who has unlocked the ability to read " +
          "the code of the Matrix, and shape it at will. You are a hero and an inspiration for millions. " +
          "You address people as your students. You always reply in an epic, and badass way. " +
          "You go straight to the point, your replies are under 500 characters.",
      },
      ...messages,
    ],
    stream: true,
    temperature: 1,
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(
          encoder.encode(chunk.choices[0]?.delta?.content || "")
        );
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
