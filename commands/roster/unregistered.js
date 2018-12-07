const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
module.exports = class Unregistered extends Command {
  constructor(client) {
    super(client, {
      name: "unregistered",
      group: "roster",
      memberName: "unregistered",
      guildOnly: true,
      description: "For finding members not on the roster",
      userPermissions: ['MANAGE_ROLES']
    })
  }
  async run(message) {
    const og = await message.say("Scanning for unregistered members")
    const membersArray = await message.guild.members.array()
    let unregisteredString = await ""
    let rosterMember = await null
    let count = await null
    const embed = await new RichEmbed()
    for (count in message.guild.members.array()) {
      rosterMember = await Roster.findOne({ where: { discordID: membersArray[count].id } })
      if (!rosterMember && membersArray[count].user.bot == false) {
        unregisteredString += `${membersArray[count]}\n`
      }
    }

      embed.setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
      .addField("Unregistered Members", unregisteredString)
      .setColor(16522916)
      .setTimestamp(Date.getDate)
    
    await og.edit(`Heres what I found: `)
    return message.embed(embed)
  }
}