const { RichEmbed } = require("discord.js")
const { Command } = require("discord.js-commando")
module.exports = class Gone extends Command {
  constructor(client) {
    super(client, {
      name: "gone",
      group: "roster",
      memberName: "gone",
      userPermissions: ['MANAGE_ROLES'],
      description: "For marking members as gone",
      guildOnly: true,
      args: [
        {
          key: "member",
          prompt: "Enter the member you want to mark as gone",
          type: "string",
        },
        {
          key: "goneDate",
          prompt: "Enter the date that they left",
          type: "string",
          default: ""
        },
        {
          key: "goneReason",
          prompt: "Enter the reason that they left",
          type: "string",
          default: ""
        }
        ]
    })
  }
  async run(message, { member, goneDate, goneReason }) {
    try {
    await Roster.update({ gone: true }, { where: { discordTag: member } })
    if (goneDate == '') {
      const d = await new Date()
      const goneToday = await `${d.getMonth() + 1}/${d.getDate()}`
      await Roster.update({ goneDate: goneToday }, { where: { discordTag: member } })
      } else {
        await Roster.update({ goneDate: goneDate }, { where: { discordTag: member } })
      }
    if (goneReason == '') {
      await Roster.update({ goneReason: "Unknown" }, { where: { discordTag: member } })
      } else {
        await Roster.update({ goneReason: goneReason }, { where: { discordTag: member } })
      }
    const rosterMember = await Roster.findOne({ where: { discordTag: member } })
    const embed = await new RichEmbed()
      .setColor(16522916)
      .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
      .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, member.avatarURL)
      .addField("Gone", "✅", true)
      .addField("Gone Date", rosterMember.goneDate, true)
      .addField("Gone Reason", rosterMember.goneReason, true)
    
    
    
    await message.say("Member modified:")
    return message.embed(embed)
    }
    catch(err) {
      await message.say("Something went wrong, I've reported the error to Pyro")
      return message.client.channels.get("520253705002418176").send(`Error: ${err}`)
    }
  }
}
