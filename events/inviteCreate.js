const croxydb = require('croxydb');

module.exports = {
    name: 'inviteCreate',
    async execute(invite, client) {
        const guildInvites = client.guildInvites.get(invite.guild.id) || new Map();
        guildInvites.set(invite.code, invite);
        client.guildInvites.set(invite.guild.id, guildInvites);

        croxydb.set(`invite_${invite.guild.id}_${invite.code}`, {
            uses: 0,
            inviter: invite.inviter.id
        });
    },
};
