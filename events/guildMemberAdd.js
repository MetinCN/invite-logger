const { EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

function calculateNextMilestone(memberCount) {
    const milestones = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
    return milestones.find(milestone => milestone > memberCount) || memberCount + 1000;
}

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const guildId = member.guild.id;
        const logChannelId = croxydb.get(`logChannel_${guildId}`);

        let inviter = "Özel URL";
        let inviterId = null;
        let inviteCode = "Özel URL";

        const newInvites = await member.guild.invites.fetch();
        const oldInvites = client.guildInvites.get(member.guild.id);
        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));

        if (invite) {
            inviter = await client.users.fetch(invite.inviterId);
            inviterId = inviter.id;
            inviteCode = invite.code;
            croxydb.add(`invites_${guildId}_${inviterId}`, 1);
            croxydb.set(`invitedBy_${guildId}_${member.id}`, inviterId);
            croxydb.set(`invite_${guildId}_${inviteCode}`, { uses: invite.uses, inviter: inviterId });
        } else {
            const vanityCode = await member.guild.fetchVanityData().catch(() => null);
            if (vanityCode) {
                inviter = "Özel URL";
                inviteCode = vanityCode.code;
            }
        }

        client.guildInvites.set(member.guild.id, new Map(newInvites.map((inv) => [inv.code, inv.uses])));

        if (logChannelId) {
            const logChannel = member.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const currentMemberCount = member.guild.memberCount;
                const nextMilestone = calculateNextMilestone(currentMemberCount);

                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('👋 Yeni Üye Katıldı')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Üye', value: `👤 ${member.user.tag}` },
                        { name: 'Discorda Kayıt Tarihi', value: `📅 ${member.user.createdAt.toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })} (${Math.floor((Date.now() - member.user.createdTimestamp) / 86400000)} gün önce)` },
                        { name: 'Davet Eden Kişi', value: `🎟️ ${inviter === "Özel URL" ? inviter : `<@${inviterId}>`}` },
                        { name: 'Davet Kodu', value: `🔗 ${inviteCode === "Özel URL" ? "Özel URL" : `discord.gg/${inviteCode}`}` }
                    )
                    .setFooter({ text: `Hedef: ${nextMilestone} • Üye Sayısı: ${currentMemberCount} • Kalan: ${nextMilestone - currentMemberCount}` });

                logChannel.send({ embeds: [embed] });
            }
        }
    },
};