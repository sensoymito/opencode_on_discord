import {
  Client,
  GatewayIntentBits,
  Events,
  SlashCommandBuilder,
} from "discord.js";
import dotenv from "dotenv";
import { askOpencode } from "./opencode/index.js";

dotenv.config();

const client = new Client({
  intents: Object.values(GatewayIntentBits),
});

client.on(Events.ClientReady, async () => {
  console.log(`${client.user.tag} でログインしました`);

  const commands = [
    new SlashCommandBuilder()
      .setName("ask")
      .setDescription("Qwen3.6 Plus が質問に答えます")
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("プロンプトテキスト")
          .setRequired(true),
      ),
    new SlashCommandBuilder()
      .setName("dev")
      .setDescription("デバッグ用")
      .addStringOption((option) =>
        option
          .setName("code")
          .setDescription("デバッグ用コード")
          .setRequired(true),
      ),
    new SlashCommandBuilder()
      .setName("trail")
      .setDescription("Opencode Goの残りトークンや消費量を表示します"),
  ];

  await client.application.commands.set(commands);
  console.log("コマンドを登録しました");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;
  const arg = interaction.options.getString("text");
  const debugarg = interaction.options.getString("code");

  switch (command) {
    case "ask":
      await interaction.deferReply();
      try {
        const { text, usage } = await askOpencode(arg);
        const reply = `${text}\n\n---\n💰 Cost: ${usage.cost}\n🔢 Tokens: Input ${usage.tokens.input}, Output ${usage.tokens.output}`;
        await interaction.editReply(reply);
      } catch (error) {
        console.error(error);
        await interaction.editReply("エラーが発生しました: " + error.message);
      }
    case "dev":
      switch (debugarg) {
        case "exit": {
            interaction.reply("Botを狩猟します")
          client.destroy();
          process.exit();
        }
      }
    case "trail":
        const used_token = ""

  }
});

client.login(process.env.DISCORD_TOKEN);
