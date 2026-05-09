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
      .setDescription("返事をしてくれます")
      .addStringOption((option) =>
        option.setName("text").setDescription("コンテキスト").setRequired(true),
      ),
    new SlashCommandBuilder()
      .setName("dev")
      .setDescription("デバッグ用")
      .addStringOption((option) =>
        option.setName("code").setDescription("デバッグ用コード").setRequired(true),
      ),
  ];

  await client.application.commands.set(commands);
  console.log("コマンドを登録しました");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;
  const arg = interaction.options.getString("text");
  const debugarg = interaction.options.getString("code")
  switch (command) {
    case "ask":
      await interaction.deferReply();
      try {
        const response = await askOpencode(arg);
        await interaction.editReply(response);
      } catch (error) {
        console.error(error);
        await interaction.editReply("エラーが発生しました: " + error.message);
      }
    case "dev":
        switch (debugarg) {
            case "exit": {
                client.destroy()
                process.exit()
            }
        }
  }
});

client.login(process.env.DISCORD_TOKEN);
