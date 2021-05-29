module.exports = {
    name: 'hello',
    aliases: ['hi'],
    args: [],
    cooldown: 0,
    execute(msg, args) {
        msg.channel.send('hi');
    },
};