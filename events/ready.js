module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} olarak giriş yapıldı!`);
        client.user.setActivity('Davetleri', { type: 'WATCHING' });

        client.guildInvites = new Map();

        client.guilds.cache.forEach(async (guild) => {
            const firstInvites = await guild.invites.fetch();
            client.guildInvites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
        });
    },
};