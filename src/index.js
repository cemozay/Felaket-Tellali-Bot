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
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'hi') {
      interaction.reply(`Merhaba!`);
    }
  
    if (interaction.commandName === 'deprem') {
      getLatestEarthquake().then(lastData => {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('Son Deprem')
          .setDescription(`${lastData.title}\nDerinlik: ${lastData.depth}\nŞiddet: ${lastData.mag}\nTarih: ${lastData.date}`)
          .setTimestamp();
        interaction.reply({ embeds: [embed] });
      });
    }
  });
  

//Get Latest Earthquake Data Function
async function getLatestEarthquake() {
    try {
        const response = await fetch('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
        const data = await response.json();

        //Last Ten Earthquake Data log
        const lastTenData = data.result.slice(0,10)

        //Last Earthquake Data
        const lastData = data.result[0];
        return lastData;
        
    } catch (error) {
        //Log any errors to the console
        console.error(error);
    }
}

client.login(process.env.TOKEN);