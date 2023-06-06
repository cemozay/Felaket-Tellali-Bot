const { Client, Intents, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
});

let channelID = null;
let isEnabled = true;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(() => {
    if (!isEnabled) return;

    checkForNewEarthquake()
      .then((newEarthquake) => {
        if (newEarthquake) {
          const channel = client.channels.cache.get(channelID);
          channel.send({ embeds: [earthquakeEmbed] });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, 300000);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName;

  if (command === 'kanalsec') {
    const channel = interaction.options.getChannel('kanal');

    if (!channel) {
      interaction.reply('Lütfen bir kanal etiketleyin!');
      return;
    }

    channelID = channel.id;

    interaction.reply(`Kanal başarıyla seçildi: ${channel}`);
  }

  if (command === 'depremaktif') {
    isEnabled = true;
    interaction.reply('Deprem bildirimi etkinleştirildi.');
  }
  if (command === 'deprempasif') {
    isEnabled = false;
    interaction.reply('Deprem bildirimi devre dışı bırakıldı.');
  }
});

client.login('token');

async function getLatestEarthquake() {
  try {
    const response = await fetch('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
    const data = await response.json();
    const lastTenData = data.result.slice(0, 10);
    const lastData = data.result[0];
    return lastData;
  } catch (error) {
    console.error(error);
  }
}

let lastEarthquakeData;
let earthquakeEmbed;

async function checkForNewEarthquake() {
  const latestData = await getLatestEarthquake();
  if (latestData.earthquake_id !== lastEarthquakeData?.earthquake_id) {
    console.log(latestData);
    earthquakeEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Son Deprem')
      .setDescription(`${latestData.title}\nŞiddet: ${latestData.mag}\nDerinlik: ${latestData.depth}\nTarih: ${latestData.date}`)
      .setTimestamp();
    lastEarthquakeData = latestData;
    return true;
  } else {
    return false;
  }
}
