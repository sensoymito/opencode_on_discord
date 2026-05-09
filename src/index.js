import {
  Client,
  GatewayIntentBits,
  Events,
  SlashCommandBuilder,
} from "discord.js";
import dotenv from "dotenv";
import { askOpencode } from "./opencode/index.js"

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
  ];

  await client.application.commands.set(commands);
  console.log("コマンドを登録しました");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;
  const arg = interaction.options.getString("text");
  switch (command) {
    case "ask":
      await interaction.reply(`${arg}: 実行`);
  }
});

client.login(process.env.DISCORD_TOKEN);
