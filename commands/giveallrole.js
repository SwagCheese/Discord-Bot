module.exports = {
    name: 'giveallrole',
    aliases: ['giveroletoall'],
    args: ['roletoadd', 'shouldaddtobots'],
    cooldown: 0,
    execute(msg, args) {
        if (msg.member.hasPermission('ADMINISTRATOR')) {
            addRoleToAllMembers(args[0], args[1]);
        } else {
            msg.channel.send('You must be an admin to use this command!');
        }
    },
};