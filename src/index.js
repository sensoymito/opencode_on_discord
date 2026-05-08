const discord = require("discord.js");
const dotenv = require("dotenv")

dotenv.config()

const client = new discord.Client({
  intents: Object.values(discord.GatewayIntentBits),
});

client.on(discord.Events.ClientReady, async () => {
  console.log(`${client.user.tag} でログインしました`);

  const commands = [
    new discord.SlashCommandBuilder()
      .setName("ask")
      .setDescription("返事をしてくれます")
      .addStringOption(option => option
        .setName("Text")
        .setDescription("コンテキスト")
        .setRequired(true)
      )
  ];

  await client.application.commands.set(commands);
  console.log("コマンドを登録しました");
});

client.on(discord.Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  if (command === "ask") {
    const arg = interaction.options.getString("Text")
    await interaction.reply(`${arg}: 実行`);
  }
});

client.login(process.env.DISCORD_TOKEN)