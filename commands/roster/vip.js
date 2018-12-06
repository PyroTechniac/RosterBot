const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
module.exports = class Vip extends Command {
  constructor(client) {
    super(client, {
      name: "vip",
      description: "For marking members as VIP",
      group: "roster",
      memberName: "vip",
      userPermissions: ['MANAGE_ROLES'],
      guildOnly: true,
      args: [
        {
          key: "member",
          prompt: "Mention or type the tag of the user that hit :pinkstar: VIP :pinkstar:",
          type: "user"
        }
        ]
    })
  }
  async run(message, { member }) {
    await Roster.update({ isVIP: true }, { where: { discordID: member.id } })
    const rosterMember = await Roster.findOne({ where: { discordID: member.id } })
    const embed = await new RichEmbed()
      .setColor(16522916)
      .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, rosterMember.discordIconURL)
      .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
      .setTimestamp(Date.getDate)
      .addField("VIP", ":white_check_mark:")
    
    
    await message.say("Member Modified: ")
    return message.embed(embed)
  }
}