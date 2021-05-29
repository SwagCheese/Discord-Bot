const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

var infinityDelayCommandsUsed = {

};

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}

bot.once('ready', () => {
    console.log('Logged in as ' + bot.user.tag + '!');
});

bot.on('message', msg => {
    if (!msg.content.startsWith(config.prefix)) return;

    if (msg.author.bot && !msg.content.startsWith('!pong')) return;

    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    if (command.beta == true && msg.author.id != '551611107039772672') return msg.channel.send('This command is still in beta! Only <@551611107039772672> can use it.')

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    if (command.cooldown != Infinity) {
        var cooldownAmount = (command.cooldown || 3) * 1000;
        if (command.cooldown == 0) {
            cooldownAmount = 0;
        }
    } else {
        if (infinityDelayCommandsUsed[msg.author.id][command.name]) return msg.channel.send("This command can only be used once to minimize lag.");
        infinityDelayCommandsUsed[msg.author.id][command.name] == true;
    }
    
    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

    if (args.length != command.args.length && command.overrideargs != true) {
        let reply = `You provided ${args.length} arguments, but this command requires ${command.args.length} arguments!`;
        let theArgs = '';
        for (let i in command.args) {
            theArgs = theArgs + ' <' + command.args[i] + '>'
        }
        if (command.aliases.length) {
            reply += `\nThe corrct usage is \`${config.prefix}${command.name}${theArgs.toLowerCase()}\`!\nAliases: \`${command.aliases}\``;
        } else {
            reply += `\nThe corrct usage is \`${config.prefix}${command.name}${theArgs.toLowerCase()}\`!`;
        }
        msg.channel.send(reply);
        return;
    }

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.channel.send(`There was an error trying to execute that command!\n(${error.toString()})`);
    }
});

bot.login(config.token);