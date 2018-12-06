const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
module.exports = class FullMember extends Command {
  constructor(client) {
    super(client, {
      name: "fullmember",
      group: "roster",
      memberName: "fullmember",
      aliases: ['full-member'],
      userPermissions: ['MANAGE_ROLES'],
      description: "For marking members as full members",
      args: [
        {
          key: "member",
          prompt: "Enter the member you want to promote",
          type: "user"
        },
        {
          key: "bungieLink",
          prompt: "Enter their Bungie Link",
          type: "string",
        },
        {
          key: "clanInvitedTo",
          prompt: "Enter which clan they were invited to",
          type: "string",
          oneOf: ['a','e']
        }
        ]
    })
  }
  async run(message, { member, bungieLink, clanInvitedTo }) {
    const check = await Roster.findOne({ where: { discordID: member.id } })
    if (check.isFlermling == true) {
      await Roster.update({ isFlermling: false, bungieLink: bungieLink, clanInvitedTo: clanInvitedTo.toLowerCase(), invited: true, joined: true }, { where: { discordID: member.id } })
      const embed = await new RichEmbed()
        .setColor(16522916)
        .setAuthor(`${member.username} || ${member.id}`, member.avatarURL)
        .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
        .setTimestamp(Date.getDate)
        .addField("Clan Invited To", `:regional_indicator_${clanInvitedTo.toLowerCase()}:`, true)
        .setTitle("Bungie Link")
        .setURL(bungieLink)
    
    
      await message.say("Member modified: ")
      return message.embed(embed)
    } else if (check.isFlermling == false) {
      return message.say(`${member.tag} is already a full member`)
    } else {
      return message.say(`${member.tag} was not found on the roster`)
    }
  }
}