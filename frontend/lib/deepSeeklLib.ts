// lib/deepseek.ts
interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function createDeepSeekStream(messages: DeepSeekMessage[]) {
  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.body;
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw error;
  }
}
