const rp = require('request-promise');

module.exports = {
    name: 'ping',
    aliases: ['pingsite', 'lag'],
    args: ['website'],
    cooldown: 0,
    execute(msg, args) {
        async function asyncFunction() {
            msg.channel.send(`Pinging ${args[0]}...`);
            var ping = 0;
            let tempPingArray = [];
            for (let i = 0; i < 101; i++) {
                let tempDate = Date.now();
                try {
                    await rp(args[0]);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send('Please send a valid url! (dont forget to include the **https://**)');
                }
                let tempDate2 = Date.now();
                tempPingArray.push(tempDate2 - tempDate);
            }

            for (let i in tempPingArray) {
                ping += tempPingArray[i];
            }
            ping = ping / tempPingArray.length;
            console.log(ping);
            msg.channel.send('Average ping from `' + args[0] + '`: ' + Math.floor(ping));
        }
        asyncFunction();
    },
};