const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top-davet')
        .setDescription('En çok davet yapanları gösterir'),
    async execute(interaction) {
        const invites = croxydb.get(`invites_${interaction.guild.id}`) || {};
        const sortedInvites = Object.entries(invites).sort((a, b) => b[1] - a[1]).slice(0, 10);
        
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🏆 En Çok Davet Yapanlar')
            .setDescription(
                sortedInvites.map(([userId, inviteCount], index) => 
                    `${index + 1}. <@${userId}>: ${inviteCount} davet 🎟️`
                ).join('\n') || 'Henüz davet yapılmamış.'
            )
            .setFooter({ text: `Toplam ${Object.keys(invites).length} kişi davet yapmış`, iconURL: interaction.guild.iconURL() });
        await interaction.reply({ embeds: [embed] });
    },
};