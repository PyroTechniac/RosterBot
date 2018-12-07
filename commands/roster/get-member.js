const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
module.exports = class GetMember extends Command {
  constructor(client) {
    super(client, {
      name: "getmember",
      group: "roster",
      memberName: "get-member",
      aliases: ['get-member'],
      guildOnly: true,
      userPermissions: ['MANAGE_ROLES'],
      description: 'For getting and refreshing member information',
      args: [
        {
          key: 'member',
          prompt: 'Enter the member you would like the information on',
          type: 'user'
        }
        ]
    })
  }
  async run(message, { member }) {
    const check = await Roster.findOne({ where: { discordID: member.id } })
    if (!check) {
      const amember = await message.guild.member(member)
      const embed = await new RichEmbed()
        .setColor(16522916)
        .setAuthor(`${amember.displayName} || ${member.id}`, member.avatarURL)
        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
        .setTimestamp(Date.getDate)
        .addField("Discord Tag", member.tag)
      let roleTitle = await "";
      let roleMessage = await amember.roles.array().slice(1).reverse().join(" | ") || "No roles found"
      if (amember.roles.array().slice(1).length == 1) {
        roleTitle = await "Role"
      } else {
        roleTitle = await "Roles"
      }
      await embed.addField(roleTitle, roleMessage, true)
      const joinedDate = await amember.joinedAt
      let joinedString = await `${joinedDate.getMonth() + 1}/${joinedDate.getDate()}/${joinedDate.getFullYear()}`
      await embed.addField("Joined At", joinedString, true)
      
      await message.say("Member not found **on the roster**, here's what I know: ")
      return message.embed(embed)
    } else {
      const amember = await message.guild.member(member)
      await Roster.update({ discordName: amember.displayName, discordTag: member.tag, discordIconURL: member.avatarURL }, {where: { discordID: member.id } })
      const rosterMember = await Roster.findOne({ where: { discordID: member.id } })
      const addedByPerson = await message.guild.members.find("id", rosterMember.addedBy).user
      let primaryEmote = await "";
      switch (rosterMember.primarySystem) {
        case "PC":
          primaryEmote = await "<:pc:514135775818940417>"
          break;
        case "XBOX":
          primaryEmote = await "<:xbox:514135718415695892>"
          break;
        case "PS4":
          primaryEmote = await "<:ps:514135745980661783>"
          break;
                                        }
      const embed = await new RichEmbed()
        if (rosterMember.bungieLink != "TBD") {
          await embed.setTitle("Bungie Link")
          await embed.setURL(rosterMember.bungieLink)
        }
      await embed.setTimestamp(rosterMember.createdAt)
        .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, rosterMember.discordIconURL)
        .setColor(16522916)
        .setFooter(`Added by ${addedByPerson.username}`, addedByPerson.avatarURL)
        .addField("Discord Tag", rosterMember.discordTag, true)
      if (rosterMember.isFlermling == true) {
        await embed.addField("Flermling?", ":white_check_mark:", true)
        await embed.addField("Primary System", primaryEmote, true)
      } else {
        await embed.addField("Primary System", primaryEmote, true)
        await embed.addField("Clan Invited To", `:regional_indicator_${rosterMember.clanInvitedTo}:`, true)
      }
      if (rosterMember.playsPC) {
        await embed.addField("PC", ":white_check_mark:", true)
      } else {
        await embed.addField("PC", ":negative_squared_cross_mark:", true)
      }
      if (rosterMember.playsPS4) {
        await embed.addField("PS4", ":white_check_mark:", true)
      } else {
        await embed.addField("PS4", ":negative_squared_cross_mark:", true)
      }
      if (rosterMember.playsXbox) {
        await embed.addField("Xbox", ":white_check_mark:", true)
      } else {
        await embed.addField("Xbox", ":negative_squared_cross_mark:", true)
      }
      if (rosterMember.isVIP) {
        await embed.addField("VIP", ":white_check_mark:", true)
      }
      if (rosterMember.isMod) {
        await embed.addField("Mod", ":white_check_mark:", true)
        if (rosterMember.isAdmin) {
          await embed.addField("Admin", ":white_check_mark:", true)
        } else {
          await embed.addField("Admin", ":negative_squared_cross_mark:", true)
        }
      }
      await embed.addBlankField()
      if (rosterMember.inactive) {
        await embed.addField("Inactive", ":white_check_mark:", true)
        await embed.addField("Last Post", rosterMember.lastPost, true)
        await embed.addField("DMed by", rosterMember.dmedBy, true)
        await embed.addBlankField()
      } else {
        await embed.addField("Inactive", ":negative_squared_cross_mark:", true)
      }
      
      if (rosterMember.gone == true && rosterMember.inactive == false) {
        await embed.addBlankField()
      }
      if (rosterMember.gone == true) {
        await embed.addField("Gone", ":white_check_mark:", true)
        await embed.addField("Gone Date", rosterMember.goneDate, true)
        await embed.addField("Gone Reason", rosterMember.goneReason, true)
        await embed.addBlankField()
      } else {
        await embed.addField("Gone", ":negative_squared_cross_mark:", true)
        await embed.addBlankField()
      }
      let roleTitle = await "";
      let roleMessage = await amember.roles.array().slice(1).reverse().join(" | ") || "No roles found"
      let joinedDate = await amember.joinedAt;
      let joinedString = await `${joinedDate.getMonth() + 1}/${joinedDate.getDate()}/${joinedDate.getFullYear()}`
      if (amember.roles.array().slice(1).length == 1) {
        roleTitle = await "Role"
      } else {
        roleTitle = await "Roles"
      }
      await embed.addField(roleTitle, roleMessage, true)
      await embed.addField("Joined At", joinedString, true)
      if (rosterMember.notes != "") {
        await embed.addField("Notes", rosterMember.notes)
      }
      
      await message.say("Member Info: ")
      return message.embed(embed)
    }
  }
}