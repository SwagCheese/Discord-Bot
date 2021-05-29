const { prototype } = require("opusscript");
const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const { Worker, parentPort, isMainThread, threadId } = require("worker_threads");

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData,
    });
    worker.on("message", (value) => console.log(value));
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function run(workerData) {
  const result = await runService(workerData);
  console.log(result);
}

if (!isMainThread) {
  parentPort.postMessage("yes");
      let driver = new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions("")
      .build();
    driver.get("https://www.kahoot.it");
    driver.findElement(By.name("gameId")).sendKeys(this.args[0], Key.RETURN);
    try {
      parentPort.postMessage("ok");
     driver.wait(until.elementLocated(By.name("nickname")), 10000);
    } catch {
      driver.quit();
      parentPort.postMessage("Thread " + threadId + " is exiting.");
      this.shouldBreakLoop = true;
      process.exit("1"); // the pin specified was invalid
    }
    driver
      .findElement(By.name("nickname"))
      .sendKeys(this.args[1] + threadId.toString(), Key.RETURN);
    driver.wait(until.urlContains("start"));
    driver.quit();
    parentPort.postMessage("Thread " + loopNum + " is exiting.");
}

module.exports = {
  name: "kahootbot",
  aliases: ["kahootbotter"],
  args: ["game pin", "name prefix (no spaces)", "number of bots"],
  beta: true,
  cooldown: 5,
  shouldBreakLoop: false,
  msg: null,
  execute(msg, args) {
    this.msg = msg;
    this.args = args;
          if (args[1].length > 17) {
        return msg.channel.send("The max length for a name is 17 characters!");
      }
      try {
        if (parseInt(args[2]) > 25 && msg.author.id != "551611107039772672") {
          return msg.channel.send("You can only send 25 bots at once!");
        }
      } catch {
        return msg.channel.send("The number of bots must be a number!");
      }

      msg.channel.send("Please wait...");

      for (let i = 0; i < parseInt(args[2]); i++) {
        if (this.shouldBreakLoop) {break;}

        run([args, i]).catch((err) => {
          console.log(err);
          this.shouldBreakLoop = true;
        });
      }
  },
};
