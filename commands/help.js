const { prefix } = require('../config.json');
module.exports = {
    name: 'help',
    aliases: ['?', 'cmds'],
    args: ['command'],
    overrideargs: true,
    cooldown: 1,
    execute(msg, args) {
        const { commands } = msg.client;
        const name = (args[0] != undefined) ? args[0].toLowerCase() : undefined;
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        const Discord = require('discord.js');
        function helpEmbed(name, description, usages, aliases, cooldown) {
            msg.channel.send(new Discord.MessageEmbed()
                .setColor(Math.floor(Math.random() * 16777215).toString(16))
                .setTitle(`${prefix}${name}`)
                .addFields(
                    { name: '**Description**', value: description },
                    { name: '**Usage**', value: usages },
                    { name: '**Aliases**', value: aliases },
                    { name: '**Cooldown**', value: cooldown},
                )
                .setTimestamp()
                .setFooter(`Requested by ${msg.author.tag}`, `${msg.author.avatarURL()}`));
        }

        if (!args.length) {
            return helpEmbed('Help', 'Get info about commands', `${prefix}${this.name} ${this.args.map(a => `<${a.toLowerCase()}>`).join(' ').trim()}`, `${this.aliases.join(', ').trim()}`, this.cooldown.toString());
        }

        if (!command) {
            return msg.reply('That\'s not a valid command!');
        }

        helpEmbed(command.name, (command.description != undefined) ? command.description : "none", `${prefix}${command.name} ${command.args.map(a => `<${a.toLowerCase()}>`).join(' ').trim()}`, (command.aliases.length > 0) ? command.aliases.join(', ').trim() : "none", `${command.cooldown || 3} second(s)`);
    },
};