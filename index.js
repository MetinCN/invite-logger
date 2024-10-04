const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token } = require('./config.json');
const croxydb = require('croxydb');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildInvites, 
        GatewayIntentBits.GuildMembers
    ] 
});

client.commands = new Collection();
client.guildInvites = new Map();

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.once('ready', async () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    
    client.guilds.cache.forEach(async (guild) => {
        const invites = await guild.invites.fetch();
        client.guildInvites.set(guild.id, new Map(invites.map((invite) => [invite.code, invite.uses])));
    });

    console.log('Slash komutları yükleniyor...');
    try {
        await client.application.commands.set(commands);
        console.log('Slash komutları başarıyla yüklendi!');
    } catch (error) {
        console.error('Slash komutları yüklenirken bir hata oluştu:', error);
    }
});

client.login(token);