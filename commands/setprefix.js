var configFile = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'setprefix',
    aliases: ['changeprefix', 'prefix'],
    args: ['prefix'],
    overrideargs: true,
    cooldown: 5,
    execute(msg, args) {
        let newPrefix = '';
        for (let i = 0; i < args.length; i++) {
            newPrefix = newPrefix + args[i].toString() + ' ';
        }
        configFile.prefix = newPrefix.slice(0, -1).toLowerCase();
        fs.writeFileSync('../config.json', JSON.stringify(configFile));
        msg.channel.send('The prefix is now ' + configFile.prefix);
    },
};