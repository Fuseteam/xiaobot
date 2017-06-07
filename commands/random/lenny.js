const Command = require('../../structures/Command');

module.exports = class LennyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lenny',
            group: 'random',
            memberName: 'lenny',
            description: 'Responds with the lenny face.'
        });
    }

    run(msg) {
        return msg.say('( ͡° ͜ʖ ͡°)');
    }
};
