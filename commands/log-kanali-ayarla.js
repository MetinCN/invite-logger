const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-kanali-ayarla')
        .setDescription('Davet loglarının gönderileceği kanalı ayarlar')
        .addChannelOption(option => 
            option.setName('kanal')
                .setDescription('Log kanalı')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!', ephemeral: true });
        }

        const channel = interaction.options.getChannel('kanal');
        croxydb.set(`logChannel_${interaction.guild.id}`, channel.id);

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Log Kanalı Ayarlandı')
            .setDescription(`Davet log kanalı başarıyla ${channel} olarak ayarlandı.`)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.tag} tarafından ayarlandı`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};