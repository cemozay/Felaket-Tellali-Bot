//Get required packages discord and dotenv
require('dotenv').config();
const { Client, IntentsBitField} = require('discord.js');

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
        interaction.reply(`${interaction.member.nickname} istekte bulundu.`);
    }
});

// Make a GET request to the API endpoint
fetch('https://api.orhanaydogdu.com.tr/deprem/kandilli/live')
    // Parse the response as JSON
    .then(response => response.json())
    // Log the parsed data to the console
    .then(data => console.log(data))
    // Log any errors to the console
    .catch(error => console.error(error));


client.login(process.env.TOKEN);