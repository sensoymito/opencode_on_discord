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
      .setDescription("返事をしてくれます"),
  ];

  await client.application.commands.set(commands);
  console.log("コマンドを登録しました");
});

client.on(discord.Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  if (command === "ask") {
    await interaction.reply("コマンド");
  }
});

client.login(process.env.DISCORD_TOKEN)