const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class WattpadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wattpad',
            group: 'search',
            memberName: 'wattpad',
            description: 'Searches Wattpad for a book.',
            args: [{
                key: 'query',
                prompt: 'What book would you like to search for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`https://api.wattpad.com:443/v4/stories?query=${query}&limit=1`)
                .set({
                    'Authorization': `Basic ${process.env.WATTPAD_KEY}`
                });
            const embed = new RichEmbed()
                .setColor(0xF89C34)
                .setAuthor('Wattpad', 'http://www.selfpubtoolbox.com/wp-content/uploads/2015/05/a6044fd3a88acd5043860484db972ca6.png')
                .setURL(body.stories[0].url)
                .setTitle(body.stories[0].title)
                .setDescription(body.stories[0].description.substr(0, 2000))
                .addField('**Author:**',
                    body.stories[0].user, true)
                .addField('**Parts:**',
                    body.stories[0].numParts, true)
                .addField('**Created On:**',
                    body.stories[0].createDate, true)
                .addField('**Votes:**',
                    body.stories[0].voteCount, true)
                .addField('**Reads:**',
                    body.stories[0].readCount, true)
                .addField('**Comments:**',
                    body.stories[0].commentCount, true);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The book may not have been found.');
        }
    }
};
