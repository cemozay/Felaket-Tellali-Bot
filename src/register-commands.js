require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'hi',
        description: 'Say hi',
    },
    {
        name: 'deprem',
        description: 'Deprem verilerini getir.',
    },
];

const rest = new REST ({ version: '10' }).setToken(process.env.TOKEN);

//Upload slash commands to bot
(async () => {
    try {
        console.log('Uploading slash commands');

        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID),
            {body: commands}
        )
        console.log('Slash commands uploaded');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();