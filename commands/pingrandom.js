module.exports = {
    name: 'pingrandom',
    aliases: ['someone', '@someone'],
    args: [],
    cooldown: 0,
    execute(msg, args) {
        let members = msg.guild.members.cache.map(i => i.toString());
        let r = Math.floor(Math.random() * members.length);
        msg.channel.send(members[r]);
    },
};