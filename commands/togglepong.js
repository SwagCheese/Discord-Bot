var { shouldPingPong } = require('../config.json');
module.exports = {
    name: 'togglepong',
    aliases: ['toggleping'],
    args: [],
    cooldown: 3,
    execute(msg, args) {
        if (shouldPingPong) {
            shouldPingPong = false;
            msg.channel.send('Pingpong is now off');
        } else {
            shouldPingPong = true;
            msg.channel.send('Pingpong is now on');
        }
    },
};