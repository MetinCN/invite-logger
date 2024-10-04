const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yardım')
        .setDescription('Bot komutlarını gösterir'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📚 Yardım Menüsü')
            .setDescription('Mevcut komutlar:')
            .addFields(
                { name: '`/yardım`', value: '📖 Bu yardım menüsünü gösterir' },
                { name: '`/top-davet`', value: '🏆 En çok davet yapanları gösterir' },
                { name: '`/davetlerim`', value: '🎟️ Davet istatistiklerinizi gösterir' },
                { name: '`/log-kanali-ayarla`', value: '📝 Davet loglarının gönderileceği kanalı ayarlar' }
            )
            .setFooter({ text: 'Davet Sistemi', iconURL: interaction.client.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed] });
    },
};
