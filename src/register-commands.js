require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'vamanos',
        description: 'ALEEEE',
    },
    {
        name: 'who-is-ready-to-fly',
        description: 'I AM',
    },
];

const rest = new REST ({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Slash komutları yukleniyor');

        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID, 
                process.env.GUILD_ID),
            {body: commands}
        )
        console.log('Slash komutları yuklendi');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();