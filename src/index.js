//Get required packages discord and dotenv
require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder} = require('discord.js');

//Set Client intents
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

//Is bot alive?
client.on('ready', (c) => {
    console.log(`${c.user.username} is online`);
});

//Bot responses to slash commands
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'hi') {
      interaction.reply(`Merhaba!`);
    }
  
    if (interaction.commandName === 'deprem') {
        ( async () => {
            await checkForNewEarthquake();
            interaction.reply({ embeds: [earthquakeEmbed] });
            setInterval(() => {
              checkForNewEarthquake().then((dataChanged) => {
                if (dataChanged) {
                  interaction.channel.send({ embeds: [earthquakeEmbed] });
                }
              });
            }, 10000);
        })();
    }
  });

//Get Latest Earthquake Data Function


client.login(process.env.TOKEN);