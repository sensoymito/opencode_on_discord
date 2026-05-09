import { createOpencode } from "@opencode-ai/sdk";

/**
 * @param {string} promptText
 *
 * @returns {Promise<any>}
 */
export async function askOpencode(promptText) {
  const api_key = process.env.OPENCODE_GO_API_KEY;

  if (!api_key) {
    throw new Error(
      "APIキーが設定されていません。環境変数 OPENCODE_GO_API_KEY を設定してください。",
    );
  }

  console.log("StartingOpencode Server");

  const { client, server } = await createOpencode({
    hostname: "127.0.0.1",
    port: 4096,
    config: {
      model: "opencode-go/qwen3.6-plus",
    },
  });

  await client.auth.set({
    path: { id: "opencode-go" },
    body: { type: "api", key: api_key },
  });

  console.log(`Server running at ${server.url}`);

  try {
    // セッション作成
    const session = await client.session.create({
      body: { title: "Modular Session" },
    });
    const sessionId = session.data?.id || session.id;

    // プロンプト送信
    console.log(`Sending prompt: "${promptText}"`);
    const result = await client.session.prompt({
      path: { id: sessionId },
      body: {
        parts: [{ type: "text", text: promptText }],
      },
    });

    console.log("Raw result:", JSON.stringify(result.data, null, 2));

    const textParts = result.data?.parts?.filter(p => p.type === "text") || [];
    const replyText = textParts.map(p => p.text).join("\n") || "応答がありませんでした";
    console.log("Response:", replyText);
    return replyText;
  } finally {
    console.log("Shutting down server...");
    server.close();
  }
}
