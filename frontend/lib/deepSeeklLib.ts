// lib/deepseek.ts
interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function createDeepSeekStream(messages: DeepSeekMessage[]) {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      // Add this if DeepSeek starts requiring API keys:
      // 'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  return response.body;
}
