
// unused as of now but could be used later

const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
module.exports = {
  name: "checkforelement",
  aliases: ["checkforcertianelement", "checkelement"],
  overrideargs: true,
  beta: true,
  args: ["url", "elementclass", "value", "checkfornotvalue", "additionalclasses(separatewithcomma)"],
  cooldown: Infinity,
  execute(msg, args) {
    checkfornotvalue;

    args4plus = "";

    for (var i = 4; i < args.length; i++) {
        args4plus.push(args[i]);
    }

    if (args[3] == "on") {
        checkfornotvalue = true;
    } else if (args[3] == "off") {
        checkfornotvalue = false;
    } else {
        msg.channel.send(`The mode argument can only be on or off, not ${args[3]}!`)
    }

    msg.channel.send("You will be pinged if ");

    let shouldBreakLoop = false;

    let driver = new Builder()
        .forBrowser("chrome")
        .setChromeOptions(new chrome.Options().headless())
        .build();
    try {
        driver.get(url);
        if ((checkfornotvalue) ? driver.findElement(By.className((args4plus != "") ? args4plus.split(",")[0] : args[1])) != args[2] : driver.findElement(By.className((args4plus != "") ? args4plus.split(",")[0] : args[1])) == args[2]) {
            msg.author.send(`<@${msg.author.id}> Element ${args[1]} was ${(checkfornotvalue) ? "not " : " "} ${args[2]} on ${args[0]}!`)
        }

    } catch (err) {
        msg.channel.send(err);
    }
  },
};
