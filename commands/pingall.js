module.exports = {
    name: 'pingall',
    aliases: [],
    args: [],
    cooldown: 10,
    execute(msg, args) {
        msg.channel.send(msg.guild.members.cache.map(i => i.toString()));
    },
};