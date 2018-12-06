const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")

module.exports = class GetMemberOld extends Command {
  constructor(client) {
    super(client, {
      name: "get-member-old",
      group: "depreciated",
      memberName: "get-member-old",
      description: "Gets information about a member in the roster",
      guildOnly: true,
      args: [
        {
          key: "member",
          prompt: "Enter the member that you would like information on",
          type: 'user',
          default: ''
        }
        ]
    })
  }
  async run(message, { member }) {
    if (!member) {
      member = message.author
    }
    const rosterMember = await Roster.findOne({ where: { discordID: member.id } })
    if (!rosterMember) {
      const joinedAt = await message.guild.member(member).joinedAt
      let roleTitle = await ""
      const roleMessage = await message.guild.member(member).roles.array().slice(1).join(" | ") || "No roles found"
      if (message.guild.member(member).roles.array().slice(1).length == 1) {
        roleTitle = await "Role"
      } else {
        roleTitle = await "Roles"
      }
      await message.say(`Member not found, here's what I know: `)
      const embed = await new RichEmbed()
        .setColor(16522916)
        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
        .setAuthor(`${message.guild.member(member).displayName} || ${member.id}`, member.avatarURL)
        .addField(roleTitle, roleMessage, true)
        .addField("Joined At", `${joinedAt.getMonth() + 1}/${joinedAt.getDate()}/${joinedAt.getFullYear()}`, true)
      
      
      
      return message.embed(embed)
    } else {
      let clanPC = await ""
      let clanPS4 = await ""
      let clanXbox = await ""
      let isInactive = await ""
      let isGone = await ""
      let primaryEmote = await ""
      let isFriend = await ""
      let isVIP = await ""
      let isMod = await ""
      let isAdmin = await ""
      let lastPost = await ""
      let dmedBy = await ""
      let goneDate = await ""
      let goneReason = await ""
      let clanInvitedTo = await ""
      let notes = await rosterMember.notes
      let lymePass = await ""
      if (rosterMember.playsPC) {
        clanPC = await "✅"
      } else {
        clanPC = await "❎"
      }
      if (rosterMember.playsPS4) {
        clanPS4 = await "✅"
      } else {
        clanPS4 = await "❎"
      }
      if (rosterMember.playsXbox) {
        clanXbox = await "✅"
      } else {
        clanXbox = await "❎"
      }
        
      switch (rosterMember.primarySystem) {
        case "PC":
          primaryEmote = await "<:pc:514135775818940417>"
          break;
        case "PS4":
          primaryEmote = await "<:ps:514135745980661783>"
          break;
        case "XBOX":
          primaryEmote = await "<:xbox:514135718415695892>"
          break;
                                        }
      if (rosterMember.gone) {
        isGone = await "✅"
        goneDate = await rosterMember.goneDate
        goneReason = await rosterMember.goneReason
      } else {
        isGone = await "❎"
      }
      if (rosterMember.inactive) {
        isInactive = await "✅"
        lastPost = await rosterMember.lastPost
        dmedBy = await rosterMember.dmedBy
      } else {
        isInactive = await "❎"
      }
      if (rosterMember.isFriend) {
        isFriend = await "✅"
      } else {
        isFriend = await "❎"
      }
      if (rosterMember.isVIP) {
        isVIP = await "✅"
      } else {
        isVIP = await "❎"
      }
      if (rosterMember.isMod) {
        isMod = await "✅"
      } else {
        isMod = await "❎"
      }
      if (rosterMember.isAdmin) {
        isAdmin = await "✅"
      } else {
        isAdmin = await "❎"
      }
      switch (rosterMember.clanInvitedTo) {
        case "A":
          clanInvitedTo = await "🇦"
          break;
        case "E":
          clanInvitedTo = await "🇪"
          break;
                                        }
      if (rosterMember.lymePass) {
        lymePass = await "✅"
      }
      let bungieLink = await rosterMember.bungieLink
      let addedDate = await rosterMember.addedDate
      let addedBy = await rosterMember.addedBy.username;
      let addedByAvatar = await rosterMember.addedBy.avatarURL;
      let roleTitle = await ""
      let roleMessage = await message.guild.member(member).roles.array().slice(1).join(" | ") || "No roles found"
      if (message.guild.member(member).roles.array().slice(1).length == 1) {
        roleTitle = await "Role"
      } else {
        roleTitle = await "Roles"
      }
      const joinedAt = await message.guild.member(member).joinedAt
      const embed = await new RichEmbed()
        .setColor(16522916)
        .setFooter(`Added by ${rosterMember.addedBy}`, rosterMember.addedByURL)
        .setTimestamp(rosterMember.createdAt)
        .setTitle("Bungie Link")
        .setURL(bungieLink)
        .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, member.avatarURL)
        .addField("Discord Tag", `${rosterMember.discordTag}`, true)
        .addField("Clan", clanInvitedTo, true)
        .addField("Primary System", primaryEmote, true)
        .addField("PC", clanPC, true)
        .addField("PS4", clanPS4, true)
        .addField("Xbox", clanXbox, true)
        .addField("Friend", isFriend, true)
        .addField("VIP", isVIP, true)
        .addBlankField()
        .addField("Mod", isMod, true)
        .addField("Admin", isAdmin, true)
        .addBlankField()
      
      
        if (rosterMember.inactive) {
          embed.addField("Inactive", isInactive, true)
          embed.addField("Last Post", lastPost, true)
          embed.addField("DMed By", dmedBy, true)
        } else {
          embed.addField("Inactive", isInactive, true)
        }
        if (rosterMember.gone) {
          embed.addBlankField()
          .addField("Gone", isGone, true)
          .addField("Gone Date", goneDate, true)
          .addField("Gone Reason", goneReason, true)
        } else {
          embed.addField("Gone", isGone, true)
        }
      embed.addBlankField()
      embed.addField(roleTitle, roleMessage, true)
        .addField("Joined At", `${joinedAt.getMonth() + 1}/${joinedAt.getDate()}/${joinedAt.getFullYear()}`, true)
        
        if (notes.length) {
          embed.addField("Notes", notes)
        }
        
      
      
      return message.embed(embed)
        
    }
  }
}