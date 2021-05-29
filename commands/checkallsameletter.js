const rp = require('request-promise');

module.exports = {
	name: 'checkallsameletter',
	aliases: ['sameletter', 'checksameletter'],
	args: [],
	cooldown: 100,
	execute(msg, args) {
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		}   
		async function aysncFunction() {
			var message = [];
			const lettersList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			for (let o in lettersList) {
				for (let i = 3; i < 17; i++) {
					await sleep(10);
					rp({ url: 'https://api.mojang.com/users/profiles/minecraft/' + lettersList[o].repeat(i) + '?at=' + (Math.round((new Date()).getTime() / 1000) - 3196800), json: true }).then(
						function (html) {
							if (html.id == undefined || html.id == null) {
								message.push(`\n${lettersList[o].repeat(i)} returned an udefined UUID and may be available`);
								return;
							}
							console.log(html.id);
							rp({ url: 'https://api.mojang.com/user/profiles/' + html.id + '/names', json: true }).then(
								function (html1) {
									if (html1[html1.length - 1]['changedToAt'] == undefined) return;
									console.log(html1[html1.length - 1]['changedToAt'] > Date.now() - 3196800000);
									if (html1[html1.length - 1]['changedToAt'] > Date.now() - 3196800000) {
										message.push(`\n${lettersList[o].repeat(i)} is available on ${new Date(html1[html1.length - 1]['changedToAt'] + 3196800000).toLocaleDateString().slice(0, 10)} at ${new Date(html1[html.length - 1]['changedToAt'] + 3196800000).toLocaleTimeString()}`);
									}
								}).catch(
									function (err) {
										console.log(err);
									});
						}
					).catch(
						function (err) {
							if (err.message == 'Cannot read property \'id\' of undefined') {
								message.push(`\n${lettersList[o].repeat(i)} returned an udefined UUID and may be available.`);
                            }
							console.log(err);
						}
					);
				}
				if (lettersList.length - 1 == o) {
					for (let g = 0; g < `Found ${message.length} usernames. ${message}`.length; g+=2000) {
						msg.channel.send(`Found ${message.length} usernames. ${message}`.substr(g, 2000));
                    }
				};
			}
		}
		aysncFunction();
	}
};