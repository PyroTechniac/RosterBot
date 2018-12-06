const { Command } = require("discord.js-commando")
module.exports = class FixCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fix",
      group: "roster",
      memberName: "fix",
      description: "For fixing member information (TESTING PURPOSES ONLY)",
      ownerOnly: true,
      args: [
        {
          key: "member",
          prompt: "Enter the member you would like to fix",
          type: "user",
        }
        ],
      guildOnly: true
    })
  }
  async run(message, { member }) {
    await Roster.update({ gone: false, goneDate: "", goneReason: "" }, { where: { discordID: member.id } })
    await Roster.update({ isFlermling: true, clanInvitedTo: "TBD", bungieLink: "TBD" }, { where: { discordID: member.id } })
    await Roster.update({ isVIP: false }, { where: { discordID: member.id } })
    return message.say(`${member.tag} fixed`)
  }
}