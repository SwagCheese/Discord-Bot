var { pingPongCounter } = require('../config.json');
var { shouldPingPong } = require('../config.json');

module.exports = {
    name: 'pong',
    aliases: [],
    args: [],
    cooldown: 0,
    execute(msg, args) {
        if (shouldPingPong == true) {
            if (!args.length) {
                setTimeout(function () { msg.channel.send('!ping ' + pingPongCounter); msg.delete(); }, 3000);
            }
            setTimeout(function () { msg.channel.send('!ping ' + (Number(args[0]) + 1).toString()); msg.delete(); }, 3000);
            pingPongCounter = (Number(args[0]) + 1);
        } else {
            msg.channel.send('Run !toggle-pong (or !toggle-ping) to enable ping pong');
        }
    },
};