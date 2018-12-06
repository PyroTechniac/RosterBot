const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
module.exports = class Modmin extends Command {
  constructor(client) {
    super(client, {
      name: "modmin",
      group: "roster",
      memberName: "modmin",
      guildOnly: true,
      description: "For promoting members to modmins",
      userPermission: ['MANAGE_ROLES'],
      args: [
        {
          key: "member",
          prompt: "Enter the member you would like to promote/demote",
          type: "user"
        },
        {
          key: "promoteDemote",
          prompt: "Enter `promote` if you're promoting them, `demote` if you're demoting them",
          type: "string",
          oneOf: ['promote', 'demote']
        },
        {
          key: "newRole",
          prompt: "Enter what their new role is: ```MEMBER, MOD, ADMIN```",
          type: "string",
          oneOf: ['member', 'mod', 'admin']
        }
        ]
    })
  }
  async run(message, { member, promoteDemote, newRole }) {
    const rosterMember = await Roster.findOne({ where: { discordID: member.id } })
    let currentRole = await 0
    let newRoleNumber = await 0
    let roleArray = await ['null', 'member', 'mod', 'admin']
    if (rosterMember.isVIP == true) {
      await currentRole++
    }
    if (rosterMember.isMod == true) {
      await currentRole++
    }
    if (rosterMember.isAdmin == true) {
      await currentRole++
    }
    if (newRole.toLowerCase() == "member") {
      newRoleNumber = await 1
    } else if (newRole.toLowerCase() == "mod") {
      newRoleNumber = await 2
    } else if (newRole.toLowerCase() == 'admin') {
      newRoleNumber = await 3
    }
    if (promoteDemote.toLowerCase() == "demote" && currentRole <= newRoleNumber) {
      return message.say(`${rosterMember.discordTag} is below or equal to the role specified, and cannot be demoted further`)
    }
    if (promoteDemote.toLowerCase() == "promote" && currentRole >= newRoleNumber) {
      return message.say(`${rosterMember.discordTag} is above or equal to the role specified, and cannot be promoted further`)
    }
    if (promoteDemote.toLowerCase() == 'promote') {
      if (roleArray[newRoleNumber] == "admin") {
        await Roster.update({ isMod: true, isAdmin: true, isVIP: true }, { where: { discordID: member.id } })
      } else if (roleArray[newRoleNumber] == "mod") {
        await Roster.update({ isMod: true, isVIP: true }, { where: { discordID: member.id } })
      }
    }
    if (promoteDemote.toLowerCase() == "demote") {
      if (roleArray[newRoleNumber] == "member") {
        await Roster.update({ isMod: false, isAdmin: false }, { where: { discordID: member.id } })
      } else if (rosterMember.isAdmin == true && roleArray[newRoleNumber] == "mod") {
        await Roster.update({ isAdmin: false }, { where: { discordID: member.id } })
    }
    }
    const rosterMemberNew = await Roster.findOne({ where: { discordID: member.id } })
    const embed = await new RichEmbed()
      .setAuthor(`${rosterMemberNew.discordName} || ${rosterMemberNew.discordID}`, rosterMemberNew.discordIconURL)
      .setColor(16522916)
      .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
      .setTimestamp(Date.getDate)
      .addField("VIP", ":white_check_mark:", true)
    if (rosterMemberNew.isMod == true) {
      embed.addField("Mod", ":white_check_mark:", true)
    } else {
      embed.addField("Mod", ":negative_squared_cross_mark:", true)
    }
    if (rosterMemberNew.isAdmin == true) {
      embed.addField("Admin", ":white_check_mark:", true)
    } else {
      embed.addField("Admin", ":negative_squared_cross_mark:", true)
    }
    
    
    await message.say("Member modified: ")
    return message.embed(embed)
  }
}