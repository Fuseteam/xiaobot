const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['banne'],
            group: 'moderation',
            memberName: 'ban',
            description: 'Bans a user and logs the ban to the mod logs.',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want to ban?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'What do you want to set the reason as?',
                    type: 'string',
                    validate: (reason) => {
                        if (reason.length < 140) return true;
                        else return 'Reason must be under 140 characters.';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const modlogs = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        const { member, reason } = args;
        if (!member.bannable) return msg.say('This member is not bannable. Perhaps they have a higher role than me?');
        try {
            await msg.say(`Are you sure you want to ban ${member.user.tag} (${member.id})?`);
            const collected = await msg.channel.awaitMessages((res) => res.author.id === msg.author.id, {
                max: 1,
                time: 15000,
                errors: ['time']
            });
            if (!['y', 'yes'].includes(collected.first().content.toLowerCase())) return msg.say('Aborting Ban.');
            try {
                await member.user.send(stripIndents`
                    You were banned from ${msg.guild.name}!
                    Reason: ${reason}
                `);
            } catch (err) {
                await msg.say('Failed to Send DM.');
            }
            await member.ban({
                days: 7,
                reason: `${msg.author.tag}: ${reason}`
            });
            await msg.say(`Successfully banned ${member.user.tag}.`);
            if (!modlogs || !modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES')) {
                return msg.say('Could not log the ban to the mod logs.');
            } else if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS')) {
                return modlogs.send(stripIndents`
                    **Member:** ${member.user.tag} (${member.id})
                    **Action:** Ban
                    **Reason:** ${reason}
                    **Moderator:** ${msg.author.tag}
                `);
            } else {
                const embed = new RichEmbed()
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setColor(0xFF0000)
                    .setTimestamp()
                    .setDescription(stripIndents`
                        **Member:** ${member.user.tag} (${member.id})
                        **Action:** Ban
                        **Reason:** ${reason}
                    `);
                return modlogs.send({ embed });
            }
        } catch (err) {
            return msg.say('Aborting Ban.');
        }
    }
};
