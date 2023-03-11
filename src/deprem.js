const { Client, Intents } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
});

let channelID;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Belirli aralıklarla API'ye istek gönderin
  //
  setInterval(() => {
    const apiUrl = 'http://api.example.com/deprem';// Tek burayı değişmemiz gerek
    const minMagnitude = 5.0;

    axios.get(apiUrl)
      .then((response) => {
        const earthquakes = response.data;

        // Deprem büyüklüğü minMagnitude'dan büyük olan depremleri alın
        const strongEarthquakes = earthquakes.filter((e) => e.magnitude >= minMagnitude);

        // Deprem verilerini seçilen kanala gönderin
        const channel = client.channels.cache.get(channelID);
        channel.send(`**Yeni Depremler:**\n${strongEarthquakes.map((e) => `- ${e.location} (${e.magnitude})`).join('\n')}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }, 300000); // 5 dakika (300 saniye) aralıklarla istek gönderin
});

client.on('interaction', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName;

  if (command === 'kanalsec') {
    const channel = interaction.options.getChannel('kanal');

    if (!channel) {
      interaction.reply('Lütfen bir kanal etiketleyin!');
      return;
    }

    // Kanalın ID'sini kaydedin
    channelID = channel.id;

    interaction.reply(`Kanal başarıyla seçildi: ${channel}`);
  }
});

client.login('token');
