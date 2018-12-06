const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")

module.exports = class NewFlermling extends Command {
  constructor(client) {
    super(client, {
      name: "addflermling",
      group: "roster",
      memberName: "add-flermling",
      description: "For adding flermlings to the roster",
      userPermissions: ['MANAGE_ROLES'],
      guildOnly: true,
      aliases: ['add-flermling', 'add-member', 'addmember'],
      args: [
        {
          key: "newFlermling",
          prompt: "Mention or enter the discord tag of the new flermling",
          type: "user",
        },
        {
          key: "playsPC",
          prompt: "Do they play D2 on PC? (YES, NO)",
          type: "string",
          oneOf: ['yes', 'no']
        },
        {
          key: "playsPS4",
          prompt: "Do they play D2 on PS4? (YES, NO)",
          type: "string",
          oneOf: ['yes', 'no']
        },
        {
          key: 'playsXbox',
          prompt: "Do they play D2 on Xbox? (YES, NO)",
          type: "string",
          oneOf: ['yes', 'no']
        },
        {
          key: "primarySystem",
          prompt: "Enter their primary system (PC, PS4, Xbox)",
          type: "string",
          oneOf: ['xbox', 'pc', 'ps4']
        },
        {
          key: "notes",
          prompt: "Enter any additional notes, or enter none",
          type: "string",
        }
        ]
    })
  }
  async run(message, { newFlermling, playsPC, playsPS4, playsXbox, primarySystem, notes }) {
    
    const check = await Roster.findOne({ where: { discordID: newFlermling.id } })
    if (check) {
      return message.say(`${newFlermling.tag} already exists on the roster`)
    }
    if (notes.toLowerCase() == 'none') {
      notes = await ""
    }
    const member = await message.guild.member(newFlermling)
    const discordID = await newFlermling.id
    const inGameName = await member.displayName
    const discordTag = await newFlermling.tag
    let xboxEmote = await ":negative_squared_cross_mark:"
    let ps4Emote = await ":negative_squared_cross_mark:"
    let pcEmote = await ":negative_squared_cross_mark:"
    let clanPC = await false
    let clanPS4 = await false
    let clanXbox = await false
    let primaryEmote = await ""
    if (playsPC.toLowerCase() == 'yes') {
      clanPC = await true
      pcEmote = await ":white_check_mark:"
    }
    if (playsPS4.toLowerCase() == 'yes') {
      clanPS4 = await true
      ps4Emote = await ":white_check_mark:"
    }
    if (playsXbox.toLowerCase() == 'yes') {
      clanXbox = await true
      xboxEmote = await ":white_check_mark:"
    }
    
    
    
    switch (primarySystem.toUpperCase()) {
      case "XBOX":
        primaryEmote = await "<:xbox:514135718415695892>"
        break;
      case "PC":
        primaryEmote = await "<:pc:514135775818940417>"
        break;
      case "PS4":
        primaryEmote = await "<:ps:514135745980661783>"
        break;
        
        
                                       }
    
    let roleTitle = await ""
    let roleMessage = await member.roles.array().slice(1).reverse().join(" | ") || "No roles given"
    if (member.roles.array().slice(1) == 1) {
      roleTitle = await "Role"
    } else {
      roleTitle = await "Roles"
    }
    const joinedServer = await member.joinedAt
    const joinedString = await `${joinedServer.getMonth() + 1}/${joinedServer.getDate()}/${joinedServer.getFullYear()}`
    await Roster.create({
      discordID: discordID,
      discordName: inGameName,
      discordIconURL: newFlermling.avatarURL,
      discordTag: discordTag,
      playsPC: clanPC,
      playsPS4: clanPS4,
      playsXbox: clanXbox,
      primarySystem: primarySystem.toUpperCase(),
      isFlermling: true,
      bungieLink: "TBD",
      isFriend: false,
      isVIP: false,
      isMod: false,
      isAdmin: false,
      invited: false,
      joined: false,
      clanInvitedTo: 'TBD',
      inactive: false,
      lastPost: "",
      dmedBy: '',
      gone: false,
      goneDate: '',
      goneReason: '',
      lymePass: false,
      notes: notes,
      addedBy: `${message.author.id}`
    })
    
    const embed = await new RichEmbed()
      .setColor(16522916)
      .setAuthor(`${inGameName} || ${discordID}`, newFlermling.avatarURL)
      .setFooter(`Added by ${message.author.username}`, message.author.avatarURL)
      .setTimestamp(Date.getDate)
      .addField("Discord Tag", newFlermling.tag, true)
      .addField('Flermling?', ':white_check_mark:', true)
      .addField('Primary System', primaryEmote, true)
      .addField("PC", pcEmote, true)
      .addField("PS4", ps4Emote, true)
      .addField("Xbox", xboxEmote, true)
      .addField(roleTitle, roleMessage, true)
      .addField("Joined At", joinedString, true)
      if (notes != '') {
        embed.addField("Notes", notes)
      }
    
    
    
    await message.say("New Member added: ")
    return message.embed(embed)
  }
}