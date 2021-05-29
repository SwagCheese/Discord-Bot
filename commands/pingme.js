module.exports = {
    name: 'pingme',
    aliases: ['remindme'],
    args: ['time', 'measurementoftime'],
    cooldown: 5,
    execute(msg, args) {
        if (Number(args[0]) == null) {
            msg.channel.send('The time you specified was invalid!');
            return;
        }

        if (args[1] != null) {
            if (args[1] == 'ms' || args[1] == 'millisecond' || args[1] == 'milliseconds') {
                msg.channel.send('Pinging ' + msg.author.username + ' in ' + args[0] + ' milliseconds.');
                args[0] = args[0];
            } else if (args[1] == 'sec' || args[1] == 'second' || args[1] == 'seconds') {
                msg.channel.send('Pinging ' + msg.author.username + ' in ' + args[0] + ' seconds.');
                args[0] = args[0] * 1000;
            } else if (args[1] == 'min' || args[1] == 'minute' || args[1] == 'minutes') {
                msg.channel.send('Pinging ' + msg.author.username + ' in ' + args[0] + ' minutes.');
                args[0] = args[0] * 60000;
            } else if (args[1] == 'hour' || args[1] == 'hours') {
                msg.channel.send('Pinging ' + msg.author.username + ' in ' + args[0] + ' hours.');
                args[0] = args[0] * 3600000;
            } else {
                msg.channel.send('Please specify a valid unit of time');
                return;
            }
        }

        setTimeout(function () {
            msg.channel.send(msg.member.toString());
        }, Number(args[0]));
    },
};