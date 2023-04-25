const { Client, Intents} = require('discord.js');
const axios = require('axios');

const client = new Client({
intents: [Intents.FLAGS.GUILDS]
});

let channelID;
let isEnabled = true; //API çağrıları etkindir

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Belirli aralıklarla API'ye istek gönderin
  setInterval(() => {
    // isEnabled değişkenine bağlı olarak API'ye istek yap veya yapma
    if (!isEnabled) return;

    const apiUrl = 'http://api.example.com/deprem';
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

client.on('interaction', async(interaction) =>{
  if(!interaction.isCommand()) return;
  
  const command = interaction.commandName;

  if(command == 'kanalsec')
  {
    const channel = interaction.options.getChannel('kanal');

    if(!channel)
    {
      interaction.reply('Lütfen bir kanal etiketleyin!');
      return;
    }

    channelID = channel.id;

    interaction.reply(`Kanal başarıyla seçildi: ${channel}`);
  }

  if(command === 'depremaktif')
  {
    isEnabled = true;
    interaction.reply('Deprem bildirimi etkinleştirildi.');
  }
  if(command === 'deprempasif')
  {
    isEnabled = false;
    interaction.reply('Deprem bildirimi devre dışı bırakıldı.');
  }
});
client.login('token');