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
async function getLatestEarthquake() {
    try {
        const response = await fetch('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
        const data = await response.json();

        //Last Ten Earthquake Data
        const lastTenData = data.result.slice(0,10)

        //Last Earthquake Data
        const lastData = data.result[0];
        return lastData;
        
    } catch (error) {
        //Log any errors to the console
        console.error(error);
    }
}

let lastEarthquakeData; // last fetched earthquake data
let earthquakeEmbed; // earthquakeEmbed for new earthquake function

// Function to fetch earthquake data and send a message if the ID has changed
async function checkForNewEarthquake() {
  const latestData = await getLatestEarthquake();
  if (latestData.earthquake_id !== lastEarthquakeData?.earthquake_id) { // if the latest data ID is different from the previous data's ID
    console.log(latestData);
    earthquakeEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Son Deprem')
      .setDescription(`${latestData.title}\nŞiddet: ${latestData.mag}\nDerinlik: ${latestData.depth}\nTarih: ${latestData.date}`)
      .setTimestamp();
    lastEarthquakeData = latestData; // update the lastEarthquakeData variable
    return true;
  }
  return false;
}


client.login(process.env.TOKEN);