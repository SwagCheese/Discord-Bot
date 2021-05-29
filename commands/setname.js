module.exports = {
  name: "setname",
  aliases: ["changename"],
  args: ["newname"],
  overrideargs: true,
  cooldown: 30,
  execute(msg, args) {
    if (msg.author.id != "551611107039772672") {
      msg.channel.send("Only <@551611107039772672> can use this command!");
    } else {
      let newName = "";
      for (let i = 0; i < args.length; i++) {
        newName = newName + args[i].toString() + " ";
      }
      msg.client.user.setUsername(newName.trim()).catch(() => {
        return msg.channel.send(
          "An error occurred. This is probably because you are changing this username too fast. Please try again later."
        );
      });
      msg.channel.send(`Setting username to ${newName}...`);
      function checkName() {
        if (msg.client.user.username != newName) {
          setTimeout(checkName, 1000);
        } else {
          msg.channel.send(`Username is now ${msg.client.user.username}!`);
        }
      }
      setTimeout(checkName, 1000);
    }
  },
};
