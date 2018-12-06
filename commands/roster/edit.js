const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
module.exports = class Edit extends Command {
  constructor(client) {
    super(client, {
      name: "edit",
      group: "roster",
      memberName: "edit",
      userPermissions: ['MANAGE_ROLES'],
      description: "For editing single fields for a member",
      guildOnly: true,
      aliases: ['update'],
      args: [
        {
          key: "member",
          prompt: "Mention or enter the tag of the member you would like to edit",
          type: "user"
        },
        {
          key: "field",
          prompt: "Enter the field you would like to edit ```PC, PS4, XBOX, PRIMARYSYSTEM, CLAN```",
          type: "string",
          oneOf: ['pc', 'ps4', 'xbox', 'primarysystem', 'clan']
        },
        {
          key: "newValue",
          prompt: "Enter the new value, or enter `toggle` if it's a toggle",
          type: "string",
          oneOf: ['e', 'a', 'xbox', 'pc', 'ps4', 'toggle']
        }
        ]
    })
  }
  async run(message, { member, field, newValue }) {
    const rosterMember = await Roster.findOne({ where: { discordID: member.id } })
    const embed = await new RichEmbed()
      .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, rosterMember.discordIconURL)
      .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
      .setTimestamp(Date.getDate)
      .setColor(16522916)
    if (field.toLowerCase() == 'pc') {
      if (rosterMember.playsPC == true) {
        await embed.addField("PC", ":negative_squared_cross_mark:")
      } else {
        await embed.addField("PC", ":white_check_mark:")
      }
      await Roster.update({ playsPC: !rosterMember.playsPC }, { where: { discordID: member.id } })
    }
    if (field.toLowerCase() == 'ps4') {
      if (rosterMember.playsPS4 == true) {
        await embed.addField("PS4", ":negative_squared_cross_mark:")
      } else {
        await embed.addField("PS4", ":white_check_mark:")
      }
      await Roster.update({ playsPS4: !rosterMember.playsPS4 }, { where: { discordID: member.id } })
    }
    if (field.toLowerCase() == 'xbox') {
      if (rosterMember.playsXbox == true) {
        await embed.addField("Xbox", ":negative_squared_cross_mark:")
      } else {
        await embed.addField("Xbox", ":white_check_mark:")
      }
      await Roster.update({ playsXbox: !rosterMember.playsXbox }, { where: { discordID: member.id } })
    }
    if (field.toLowerCase() == 'primarysystem') {
      if (newValue.toLowerCase() == 'xbox') {
        await embed.addField("Primary System", "<:xbox:514135718415695892>")
        await Roster.update({ primarySystem: "XBOX" }, { where: { discordID: member.id } })
      } else if (newValue.toLowerCase() == 'pc') {
        await embed.addField("Primary System", "<:pc:514135775818940417>")
        await Roster.update({ primarySystem: "PC" }, { where: { discordID: member.id } })
      } else if (newValue.toLowerCase() == 'ps4') {
        await embed.addField("Primary System", "<:ps:514135745980661783>")
        await Roster.update({ primarySystem: "PS4" }, { where: { discordID: member.id } })
      }
    }
    if (field.toLowerCase() == 'clan') {
      if (rosterMember.isFlermling == true) return message.say(`${member.tag} is a flermling`)
      await Roster.update({ clanInvitedTo: newValue.toLowerCase() }, { where: { discordID: member.id } })
      await embed.addField("Clan Invited To", `:regional_indicator_${newValue}`)
    }
    
    await message.say("Member Modified: ")
    return message.embed(embed)
  }
}