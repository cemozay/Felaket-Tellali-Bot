require('dotenv').config();
const { Client, IntentsBitField} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.username} is online`);
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'vamanos') {
        interaction.reply('ALEEEEEEEEEEEEEEEEEEE!');
    }
    if (interaction.commandName === 'who-is-ready-to-fly') {
        interaction.reply(`I AM ${interaction.member.nickname}`);
    }
});

client.login(process.env.TOKEN);