const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");


module.exports = class AddMember extends Command {
  constructor(client) {
    super(client, {
      name: 'add-member-old',
      group: 'depreciated',
      memberName: 'add-member-old',
      guildOnly: true,
      description: 'For adding new members to the roster',
      args: [
        {
          key: 'newUser',
          prompt: 'Mention the new member you would like to add',
          type: 'user'
        },
        {
          key: 'playsPC',
          prompt: "Enter true if they're in the PC Clan, false if they're not",
          type: 'boolean',
          oneOf: ['true', 'false']
        },
        {
          key: 'playsPS4',
          prompt: "Enter true if they're in the PS4 Clan, false if they're not",
          type: 'boolean',
          oneOf: ['true', 'false']
        },
        {
          key: 'playsXbox',
          prompt: "Enter true if they're in the Xbox Clan, false if they're not",
          type: 'boolean',
          oneOf: ['true', 'false']
        },
        {
          key: 'primarySystem',
          prompt: "Please Enter their primary system (Available systems: XBOX, PC, PS4)",
          type: 'string',
          oneOf: ['Xbox', 'PC', 'PS4', 'xbox', 'pc', 'ps4', 'XBOX', 'Pc', 'Ps4']
        },
        {
          key: 'bungieLink',
          prompt: 'Enter their bungie link',
          type: 'string'
        },
        {
          key: 'isFriend',
          prompt: "Enter true if they're a friend, false if they're not",
          type: 'boolean',
          oneOf: ['true', 'false']
        },
        {
          key: 'isVIP',
          prompt: "Enter true if they're a VIP, false if they're not",
          type: 'boolean',
          default: false
        },
        {
          key: 'isMod',
          prompt: "Enter true if they're a Mod, false if they're not",
          type: 'boolean',
          default: false
        },
        {
          key: 'isAdmin',
          prompt: "Enter true if they're an Admin, false if they're not",
          type: 'boolean',
          default: false
        },
        {
          key: 'clanInvitedTo',
          prompt: "Enter A if they were invited to Clan A, E if they were invited to Clan E",
          type: 'string',
          oneOf: ['A', 'E', 'a', 'e']
        },
        {
          key: 'invited',
          prompt: "Enter true if they were invited, false if they weren't",
          type: 'boolean',
          oneOf: ['true', 'false']
        },
        {
          key: 'joined',
          prompt: "Enter true if they joined, false if they didn't",
          type: 'boolean',
          oneOf: ['true', 'false']
        },
        {
          key: 'notes',
          prompt: "Enter any additional notes",
          type: "string",
          default: ""
        },
        ]
    })
  }
  async run(message, { newUser, playsPC, playsPS4, playsXbox, primarySystem, bungieLink, isFriend, isVIP, isMod, isAdmin, invited, joined, clanInvitedTo, notes }) {
    try {  
      const newMember = await message.guild.member(newUser);
      const check = await Roster.findOne({ where: { discordID: newUser.id } })
      if (check) {
        throw `${newUser.tag} is already on the roster`
      }
      const member = await Roster.create({
        discordID: newUser.id,
        discordName: newMember.displayName,
        discordTag: newUser.tag,
        playsPC: playsPC,
        playsPS4: playsPS4,
        playsXbox: playsXbox,
        primarySystem: primarySystem.toUpperCase(),
        bungieLink: bungieLink,
        isFriend: isFriend,
        isVIP: isVIP,
        isMod: isMod,
        isAdmin: isAdmin,
        invited: invited,
        joined: joined,
        clanInvitedTo: clanInvitedTo.toUpperCase(),
        inactive: false,
        lastPost: '',
        dmedBy: '',
        gone: false,
        goneDate: '',
        goneReason: '',
        lymePass: false,
        notes: notes,
        addedBy: `${message.author.username}`,
        addedByURL: `${message.author.avatarURL}`,
        addedDate: Date.getDate
      });
      let clanPC = await ""
      let clanPS4 = await ""
      let clanXbox = await ""
      if (playsPC) {
        clanPC = await "✅"
      } else {
        clanPC = await "❎"
      }
      if (playsPS4) {
        clanPS4 = await "✅";
      } else {
        clanPS4 = await "❎"
      }
      if (playsXbox) {
        clanXbox = await "✅"
      } else {
        clanXbox = await "❎"
      }
      let primaryEmote = await ""
      if (primarySystem.toUpperCase() == "PC") {
        primaryEmote = await "<:pc:514135775818940417>"
      } else if (primarySystem.toUpperCase() == 'PS4') {
        primaryEmote = await "<:ps:514135745980661783>"
      } else if (primarySystem.toUpperCase() == "XBOX") {
        primaryEmote = await "<:xbox:514135718415695892>"
      }
      let clanInvitedEmote = ""
      if (clanInvitedTo.toUpperCase() == "A") {
        clanInvitedEmote = await "🇦"
      } else {
        clanInvitedEmote = await "🇪"
      }
      const roleMessage = await newMember.roles.array().slice(1).join(" | ") || 'No roles found';
      let roleFieldTitle = await "";
      if (newMember.roles.array().slice(1).length == 1) {
        roleFieldTitle = await "Current Role"
      } else {
        roleFieldTitle = await "Current Roles"
      }
      const embed = await new RichEmbed()
        .setColor(16522916)
        .setAuthor(`${newMember.displayName} || ${newUser.id}`, newUser.avatarURL)
        .setFooter(`Added by ${message.author.username}`, message.author.avatarURL)
        .setTimestamp(Date.getDate)
        .addField("Discord Tag", `${newUser.tag}`, true)
        .addField("Clan", clanInvitedEmote, true)
        .addField("Primary System", primaryEmote, true)
        .setTitle("Bungie Link")
        .setURL(bungieLink)
        .addField("PC", clanPC, true)
        .addField("PS4", clanPS4, true)
        .addField("Xbox", clanXbox, true)
        .addField(roleFieldTitle, roleMessage)
        if (notes.length) {
          embed.addField("Notes", notes)
        }
    
    
      
    
    
    

      const newMessage = await message.say("New Member: ");
      return message.embed(embed)
    }
  
  catch(err) {
    message.say(err)
  }
    
  }
}
  