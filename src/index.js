import { Client, GatewayIntentBits, Events, SlashCommandBuilder,} from "discord.js";
import dotenv from "dotenv";
import { askOpencode, init as initOpencode, shutdown as shutdownOpencode } from "./opencode/index.js";

dotenv.config();

const client = new Client({
  intents: Object.values(GatewayIntentBits),
});

client.on(Events.ClientReady, async () => {
  console.log(`${client.user.tag} でログインしました`);
  await initOpencode();

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
      if (!interaction.isRepliable()) return;
      await interaction.deferReply().catch(err => {
        console.error("Defer failed:", err);
      });
      if (!interaction.deferred) return;

      try {
        const replyText = await askOpencode(arg);
        await interaction.editReply(replyText);
      } catch (error) {
        console.error(error);
        if (interaction.isRepliable()) {
          await interaction.editReply("エラーが発生しました: " + error.message);
        }
      }
      break;
    case "dev":
      switch (debugarg) {
        case "exit": {
            interaction.reply("Botを終了します");
            shutdownOpencode();
            client.destroy();
            process.exit();
        }
      }
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
