const http = require('http');
const express = require('express');
const app = express();


const { CommandoClient, SQLiteProvider, FriendlyError } = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const Sequelize = require('sequelize');
const config = require("./config.json");
const client = new CommandoClient({
    commandPrefix: config.prefix,
    owner: config.owners,
    disableEveryone: true,
    invite: 'https://discord.gg/fwK2657',
    unknownCommandResponse: false,
});
const testOne = async (err, channel, args, command) => {
  if (err.name == "TypeError") {
    const member = args[Object.keys(args)[0]]
    const check = Roster.findOne({ where: { discordID: member.id } })
    if (check.discordID == undefined) {
      channel.send(`${member.tag} does not exist on the roster`)
    } else {
      channel.send("An error has occured, I have let Pyro know")
  }
} else {
  channel.send("An error has occured, I have let Pyro know")
}
}


const rosterBase = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  operatorAliases: false,
  storage: 'roster.sqlite'
});
global.Roster = rosterBase.define('roster', {
  discordID: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
  },
  discordName: Sequelize.STRING,
  discordTag: Sequelize.STRING,
  discordIconURL: Sequelize.STRING,
  playsPC: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  playsPS4: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  playsXbox: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  primarySystem: Sequelize.STRING,
  isFriend: {
    type: Sequelize.BOOLEAN,
    defaulValue: false,
  },
  bungieLink: Sequelize.STRING,
  isVIP: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isFlermling: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  isMod: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  invited: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  joined: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  clanInvitedTo: Sequelize.STRING,
  inactive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  lastPost: Sequelize.STRING,
  dmedBy: Sequelize.STRING,
  gone: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  goneDate: Sequelize.STRING,
  goneReason: Sequelize.STRING,
  lymePass: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  notes: Sequelize.TEXT,
  addedBy: Sequelize.STRING,
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['roster', 'Roster Commands'],
        ['depreciated', 'Depreciated Commands'],
  
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({})
    .registerCommandsIn(path.join(__dirname, 'commands'));
sqlite.open(path.join(__dirname, "settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});
client.on("ready", () => {
    console.log('Logged In!');
    client.user.setActivity('with the roster');
    Roster.sync();
})

client.on("commandError", (command, err, message, args, fromPattern) => {
  client.channels.get("520253705002418176").send(`${err.name}: ${err.message}`)
  err.catch(testOne(err, message.channel, args, command))
})
client.on("error", err => {
  client.channels.get("520253705002418176").send(`${err.name}: ${err.message}`)
})
  
client.login(process.env.TOKEN);

















app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 100000);