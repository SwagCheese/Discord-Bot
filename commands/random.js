module.exports = {
    name: 'random',
    aliases: ['randomnum'],
    args: [],
    cooldown: 0,
    execute(msg, args) {
        let r = Math.floor(Math.random() * 100000);
        msg.channel.send(r);
        if (r === 69420 || r === 69 || r === 420) {
            msg.channel.send('https://t4.rbxcdn.com/3c2a1a217e73bbbc1d12888d46d9cff2');
            msg.channel.send('***N O I C E***')
        }
    }, 
};