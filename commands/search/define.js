const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { WORDNIK_KEY } = process.env;

module.exports = class DefineCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'define',
            group: 'search',
            memberName: 'define',
            description: 'Defines a word.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to define?',
                    type: 'string',
                    parse: (query) => encodeURIComponent(query)
                }
            ]
        });
    }

    async run(msg, args) {
        const { query } = args;
        const { body } = await snekfetch
            .get(`http://api.wordnik.com:80/v4/word.json/${query}/definitions`)
            .query({
                limit: 1,
                includeRelated: false,
                useCanonical: false,
                api_key: WORDNIK_KEY
            });
        if (!body.length) return msg.say('No Results.');
        const embed = new RichEmbed()
            .setColor(0x9797FF)
            .setTitle(body[0].word)
            .setDescription(body[0].text);
        return msg.embed(embed);
    }
};
