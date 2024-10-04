const { EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

function calculateNextMilestone(memberCount) {
    const milestones = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
    return milestones.find(milestone => milestone > memberCount) || memberCount + 1000;
}

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        const guildId = member.guild.id;
        const logChannelId = croxydb.get(`logChannel_${guildId}`);

        let inviter = "Bilinmiyor";
        let inviterId = croxydb.get(`invitedBy_${guildId}_${member.id}`);
        let inviteCode = "Bilinmiyor";

        if (inviterId) {
            inviter = await client.users.fetch(inviterId).catch(() => null);
            if (inviter) {
                const userInvites = await member.guild.invites.fetch({ inviter: inviter }).catch(() => null);
                if (userInvites && userInvites.size > 0) {
                    inviteCode = userInvites.first().code;
                }
                croxydb.subtract(`invites_${guildId}_${inviterId}`, 1);
                croxydb.add(`leaves_${guildId}_${inviterId}`, 1);
            }
        }

        croxydb.delete(`invitedBy_${guildId}_${member.id}`);

        if (logChannelId) {
            const logChannel = member.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const currentMemberCount = member.guild.memberCount;
                const nextMilestone = calculateNextMilestone(currentMemberCount);

                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('👋 Üye Ayrıldı')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Üye', value: `👤 ${member.user.tag}` },
                        { name: 'Discorda Kayıt Tarihi', value: `📅 ${member.user.createdAt.toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })} (${Math.floor((Date.now() - member.user.createdTimestamp) / 86400000)} gün önce)` },
                        { name: 'Ayrılma Zamanı', value: `📅 ${new Date().toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}` },
                        { name: 'Davet Eden Kişi', value: `🎟️ ${inviter instanceof Object ? `<@${inviterId}>` : inviter}` },
                        { name: 'Davet Kodu', value: `🔗 ${inviteCode !== "Bilinmiyor" ? `discord.gg/${inviteCode}` : inviteCode}` }
                    )
                    .setFooter({ text: `Hedef: ${nextMilestone} • Üye Sayısı: ${currentMemberCount} • Kalan: ${nextMilestone - currentMemberCount}` });

                logChannel.send({ embeds: [embed] });
            }
        }
    },
};