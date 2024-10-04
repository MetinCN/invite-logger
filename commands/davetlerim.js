const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('davetlerim')
        .setDescription('Davet istatistiklerinizi gösterir'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        const invites = croxydb.get(`invites_${guildId}_${userId}`) || 0;
        const leaves = croxydb.get(`leaves_${guildId}_${userId}`) || 0;
        const total = invites + leaves;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`🎟️ Davet İstatistikleri`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Toplam Davet', value: `🔢 ${total}`, inline: true },
                { name: 'Sunucuda Olanlar', value: `👥 ${invites}`, inline: true },
                { name: 'Sunucudan Çıkanlar', value: `👋 ${leaves}`, inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    },
};//Made by discord.gg/msidev