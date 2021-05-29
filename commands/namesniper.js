const { response } = require("express");
const rp = require("request-promise");

module.exports = {
  name: "namesniper",
  aliases: ["ns", "namesnipe"],
  args: ["name"],
  description: "A command that can snipe minecraft names for you.",
  overrideargs: true,
  cooldown: 0,
  beta: false,
  execute(msg, args) {
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    msg.author.createDM().then(asyncFunction);

    async function asyncFunction() {
      msg.author.send(
        "Please input your minecraft account's email.\n You can say `cancel` to this."
      );

      const authorID = msg.author.id;
      const filter = (response) => {
        return response.author.id === authorID;
      };

      function checkForCancel(message) {
        if (message.toString().toLowerCase() == "cancel") {
          msg.author.send("Cancelled.");
          return true;
        }
      }

      msg.author.dmChannel
        .awaitMessages(filter, { max: 1 })
        .then((collected1) => {
          if (checkForCancel(collected1.first())) return;

          var email = collected1.first();

          msg.author.send(
            `Email set to ||${email}||. Please input your account password.`
          );

          msg.author.dmChannel
            .awaitMessages(filter, { max: 1 })
            .then((collected2) => {
              if (checkForCancel(collected2.first())) return;

              var password = collected2.first();

              msg.author.send(
                `Password set to ||${password}||. Please input the name you would like to snipe.`
              );

              msg.author.dmChannel
                .awaitMessages(filter, { max: 1 })
                .then((collected3) => {
                  if (checkForCancel(collected3.first())) return;

                  const nameToSnipe = collected3.first();

                  msg.author.send(`Sniping ${nameToSnipe}...`);

                  let filter1 = (response1) => {
                    response1.content.toLowerCase() == "cancel";
                  };

                  msg.author.dmChannel
                    .awaitMessages(filter1, { max: 1 })
                    .then((collected4) => {
                      return msg.channel.send("Cancelled.");
                    });
                  try {
                    rp({
                      method: "POST",
                      uri: "http://authserver.mojang.com/authenticate",
                      body: {
                        agent: {
                          name: "Minecraft",
                          version: 1,
                        },
                        username: email.toString(),
                        password: password.toString(),
                      },
                      json: true,
                      followAllRedirects: true,
                    }).then((html2) => {
                      console.log(
                        html2["accessToken"] + html2["clientToken"]
                      );
                      var accessToken = html2["accessToken"];
                      var clientToken = html2["clientToken"];
                      var f16 = accessToken.split(".")[1].substring(0, 16);
                      rp({
                        url:
                          "https://api.minecraftservices.com/minecraft/profile/namechange",
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                        },
                        json: true,
                      }).then((response3) => {
                        if (response["nameChangeAllowed"] == false) {
                          return msg.author.send(
                            "Your name cannot be changed right now! Try again later."
                          );
                        }
                      });
                      rp({
                        method: "GET",
                        uri: "https://api.mojang.com/user/security/challenges",
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                        },
                        json: true,
                        followAllRedirects: true,
                      }).then((html3) => {
                        if (html3.toString() == "[]" || html3.toString() == []) {
                          msg.author.send("Readied token for usage");
                        } else {
                          rp({
                            url:'https://api.mojang.com/user/security/location',
                            headers: {
                              Authorization: `Bearer ${accessToken}`
                            },
                            json:true
                          }).then((response6) => {
                            if (response6.statusCode == 204) {
                              msg.author.send("Readied token for usage");
                            } else {
                              msg.author.send(
                                "Security questions are unanswered. Please answer the following questions."
                              );
                              console.log(html3);
                              msg.author.send(html3[0]["question"]["question"]);
    
                              msg.author.dmChannel
                                .awaitMessages(filter, { max: 1 })
                                .then((answer1) => {
                                  msg.author.send(html3[1]["question"]["question"]);
                                  msg.author.dmChannel
                                    .awaitMessages(filter, { max: 1 })
                                    .then((answer2) => {
                                      msg.author.send(
                                        html3[2]["question"]["question"]
                                      );
                                      msg.author.dmChannel
                                        .awaitMessages(filter, {
                                          max: 1,
                                        })
                                        .then((answer3) => {
                                          rp({
                                            url:
                                              "https://api.mojang.com/user/security/location",
                                            headers: {
                                              Authorization: `Bearer ${accessToken}`,
                                            },
                                            body: [
                                              {
                                                "id": html3[0]["answer"]["id"],
                                                "answer": answer1.toString().trim(),
                                              },
                                              {
                                                "id": html3[1]["answer"]["id"],
                                                "answer": answer2.toString().trim(),
                                              },
                                              {
                                                "id": html3[2]["answer"]["id"],
                                                "answer": answer3.toString().trim(),
                                              },
                                            ],
                                            json: true
                                          }).then((response5) => {
                                            if (response5.statusCode == 204) {
                                              msg.author.send("Questions answered correctly. Readied token for usage.");
                                            } else {
                                              return msg.author.send("One or more questions were incorrect! Please try again.")
                                            }
                                          }).catch((err) => {
                                            console.log("Status code: " + err.statusCode);
                                            if (err.statusCode == 204) {
                                              msg.author.send("Questions answered correctly. Readied token for usage.");
                                            } else {
                                              return msg.author.send("One or more questions were incorrect! Please try again.")
                                            }
                                          });
                                        });
                                    });
                                });
                            }
                          });
                        }
                        try {
                          rp({
                            url:
                              "https://api.nathan.cx/check/" + nameToSnipe.toString(),
                            method: "GET",
                            json: true,
                          })
                            .then(async (html1) => {
                              if (html1["status"] == "available") {
                                console.log(html1);
                                return msg.author.send(
                                  "That name is already available!"
                                );
                              } else if (html1["status"] == "taken") {
                                return msg.author.send(
                                  "That name is already taken! You can't snipe it!"
                                );
                              } else if (html1["status"] == "soon") {
                                dropTime = Date.parse(html1["drop_time"]);
                              }
                              console.log(
                                "Drop time: " + (dropTime - Date.now()).toString()
                              );
                              const content = {
                                method: "POST",
                                uri: "http://authserver.mojang.com/authenticate",
                                body: {
                                  agent: {
                                    name: "Minecraft",
                                    version: 1,
                                  },
                                  username: email.toString(),
                                  password: password.toString(),
                                },
                                json: true,
                                followAllRedirects: true,
                              };
      
                              if (dropTime - Date.now() - 60000 > 0) {
                                try {
                                  console.log(
                                    `Sleeping for ${
                                      dropTime - Date.now() - 60000
                                    } ms.`
                                  );
                                  msg.author.send(`The process will continue at ${new Date(dropTime - (Date.now() - 120000)).toTimeString()} on ${new Date(dropTime).toLocaleDateString().slice(0, 10)}. You will be pinged.`);
                                  await sleep((dropTime - Date.now() - 120000) / 2);
                                  await sleep((dropTime - Date.now() - 120000) / 2);
                                  msg.author.send(`<@${msg.author.id}>`);
                                } catch (err) {
                                  console.error(err);
                                }
                              }
      
                              try {
                                rp(content)
                                  .then(async function (parsedBody) {
                                    console.log(
                                      parsedBody["accessToken"] +
                                        parsedBody["clientToken"]
                                    );
                                    var accessToken = parsedBody["accessToken"];
                                    var clientToken = parsedBody["clientToken"];
                                    var f16 = accessToken
                                      .split(".")[1]
                                      .substring(0, 16);
                                    msg.author.send(
                                      `Got access token. First 16 letters of middle are ${f16}.`
                                    );
                                    rp({
                                      url:
                                        "https://api.minecraftservices.com/minecraft/profile/namechange",
                                      headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                      },
                                      json: true,
                                    }).then((response3) => {
                                      if (response["nameChangeAllowed"] == false) {
                                        return msg.author.send(
                                          "Your name cannot be changed right now! Try again later."
                                        );
                                      }
                                    });
                                        rp({
                                          url:
                                            "https://api.minecraftservices.com/minecraft/profile",
                                          headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                          },
                                          json: true,
                                        })
                                          .then(async function (parsedBody1) {
                                            var userUUID = parsedBody1.id;
                                            console.log(userUUID);
      
                                            var ping = 0;
                                            let tempDate = Date.now();
                                            await rp({
                                              url:
                                                "https://api.minecraftservices.com/minecraft/profile",
                                              headers: {
                                                Authorization: `Bearer ${accessToken}`,
                                              },
                                            });
                                            let tempDate2 = Date.now();
                                            ping = (tempDate2 - tempDate) / 2;
      
                                            ping = ping / 2;
                                            console.log("ping is " + ping + "ms");
                                            msg.author.send(`Ping is ${ping} ms.`);
      
                                            await sleep(
                                              dropTime -
                                                Date.now() -
                                                (250 + Math.floor(ping))
                                            );
      
                                            var snipedAlready = false;
                                            (function loopThing(i) {
                                              setTimeout(function () {
                                                if (snipedAlready) {
                                                  return;
                                                }
                                                rp({
                                                  url:
                                                    "https://api.nathan.cx/check/" +
                                                    nameToSnipe.toString(),
                                                  method: "GET",
                                                  json: true,
                                                }).then((response4) => {
                                                  console.log(response4);
                                                });
                                                rp({
                                                  uri: `https://api.minecraftservices.com/minecraft/profile/name/${nameToSnipe}`,
                                                  headers: {
                                                    Authorization: `Bearer ${accessToken}`,
                                                  },
                                                  method: "PUT",
                                                  json: true
                                                }).then(async function (
                                                  response
                                                ) {
                                                  try {
                                                    console.log(
                                                      `Status code: ${response.statusCode}.`
                                                    );
                                                    if (
                                                      response.statusCode == "200"
                                                    ) {
                                                      if (!snipedAlready) {
                                                        msg.channel.send(
                                                          "**Snipe success!**"
                                                        );
                                                      }
                                                      snipedAlready = true;
                                                    }
                                                  } catch (err) {
                                                    if (
                                                      response.statusCode == "200"
                                                    ) {
                                                      if (!snipedAlready) {
                                                        msg.channel.send(
                                                          "**Snipe success!**"
                                                        );
                                                      }
                                                      snipedAlready = true;
                                                    } else {
                                                      console.log(err);
                                                    }
                                                  }
                                                });
                                                if (--i) {
                                                  loopThing(i);
                                                }
                                              }, 50);
                                            })(3);
      
                                            await sleep(dropTime - Date.now() + 300);
      
                                            rp({
                                              url:
                                                "https://api.minecraftservices.com/minecraft/profile",
                                              headers: {
                                                Authorization: `Bearer ${accessToken}`,
                                              },
                                              json: true,
                                            }).then((response2) => {
                                              if (
                                                response2["name"] !=
                                                nameToSnipe.toString()
                                              ) {
                                                msg.author.send(
                                                  "**Failed Snipe!** Better luck next time."
                                                );
                                              } else {
                                                rp({
                                                  method: "POST",
                                                  url:
                                                    "https://api.minecraftservices.com/minecraft/profile/skins",
                                                  headers: {
                                                    Authorization: `Bearer ${accessToken}`,
                                                  },
                                                  payload: {
                                                    variant: "classic",
                                                    file:
                                                      "C:\\Users\\hityn\\Documents\\programming\\nodejs\\discord bot\\293e03da2b6d1b2a.png",
                                                  },
                                                  json: true,
                                                });
                                              }
                                            });
                                          })
                                          .catch(function (err) {
                                            console.log(err);
                                            msg.author.send(err.toString());
                                          });
                                      })
                                      .catch(function (err) {
                                        console.error(err);
                                        msg.author.send(
                                          "The token was invalid or an unexpected error ocurred. Make sure you are not running minecraft on this account."
                                        );
                                  })
                                  .catch(function (err) {
                                    console.error(err);
                                    msg.author.send(err.toString());
                                  });
                              } catch (err) {
                                console.error(err);
                                msg.author.send(err.toString());
                              }
                            })
                            .catch(function (err) {
                              console.error(err);
                              msg.author.send(
                                err.toString() +
                                  ". You probably put in a name that does not exist!"
                              );
                            });
                          } catch (err) {
                            msg.author.send(err.toString());
                          }
                      });
                    }).catch((err) => {
                      return msg.author.send("Invalid credentials. Please try again.")
                    });
                  } catch (err) {
                    msg.channel.send(err);
                    console.warn(err);
                  }
                });
            });
          });
    }
  },
}
