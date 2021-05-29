module.exports = {
    name: 'spam',
    aliases: [],
    args: ['message to spam', 'how many times to spam'],
    cooldown: 5,
    overrideargs: true,
    execute(msg, args) {
        if (Number(args[args.length - 1]) == null) {
            msg.channel.send('Please specify how many times to spam');
        } else if (Number(args[args.length - 1]) > 1000) {
            msg.channel.send('That number is too big! \n The maximum number is 1000');
        } else {
            let spamMessage = '';
            for (let o = 0; o < args.length - 1; o++) {
                spamMessage = spamMessage.concat(args[o] + ' ');
            }
            try {
                for (let i = 0; i < args[args.length - 1]; i++) {
                    msg.channel.send(spamMessage);
                }
            } catch (e) {
                msg.channel.send('An error has occurred.\n' + e);
                console.warn(e);
                return;
            }
        }
    },
};