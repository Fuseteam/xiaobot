const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { GIPHY_KEY } = process.env;

module.exports = class GiphyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'giphy',
            group: 'search',
            memberName: 'giphy',
            description: 'Searches for GIFs with Giphy.',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to search for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { query } = args;
        const { body } = await snekfetch
            .get('http://api.giphy.com/v1/gifs/search')
            .query({
                q: query,
                api_key: GIPHY_KEY,
                rating: msg.channel.nsfw ? 'r' : 'pg'
            });
        if (!body.data.length) return msg.say('No Results.');
        const random = Math.floor(Math.random() * body.data.length);
        return msg.say(body.data[random].images.original.url);
    }
};
