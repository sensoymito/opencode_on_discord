import { createOpencode } from "@opencode-ai/sdk";

let client = null;
let server = null;

export async function init() {
  if (client) return;

  console.log("Starting Opencode Server...");
  const res = await createOpencode({
    hostname: "127.0.0.1",
    port: 4096,
    config: {
      model: "opencode-go/qwen3.6-plus",
    },
  });

  client = res.client;
  server = res.server;

  await client.auth.set({
    path: { id: "opencode-go" },
    body: { type: "api", key: process.env.OPENCODE_GO_API_KEY },
  });
  console.log(`Server running at ${server.url}`);
}

export async function askOpencode(promptText) {
  if (!client) await init();

  const session = await client.session.create({
    body: { title: "Session" },
  });
  const sessionId = session.data?.id || session.id;

  const result = await client.session.prompt({
    path: { id: sessionId },
    body: {
      parts: [{ type: "text", text: `以下の質問に日本語で答えてください: ${promptText} あとなにかファイルやフォルダを作るときは dist フォルダに作ってね` }],
    },
  });

  const textParts = result.data?.parts?.filter(p => p.type === "text") || [];
  return textParts.map(p => p.text).join("\n") || "応答がありませんでした";
}

export function shutdown() {
  if (server) {
    server.close();
    console.log("Opencode server shut down.");
  }
}
