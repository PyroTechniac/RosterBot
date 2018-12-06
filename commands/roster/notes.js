const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
module.exports = class NotesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "notes",
      group: "roster",
      memberName: "notes",
      userPermissions: ['MANAGE_ROLES'],
      description: "For adding notes to members",
      aliases: ['note', 'add-notes', 'change-notes', 'addnotes', 'changenotes'],
      args: [
        {
          key: 'member',
          prompt: "Enter the member you would like to add/change the notes for",
          type: 'user',
        },
        {
          key: 'appendType',
          prompt: 'Enter `overwrite` if you want to overwrite the member\'s notes, or `append` if you would like to add to them',
          type: "string",
          oneOf: ['overwrite', 'append']
        },
        {
          key: "notes",
          prompt: "Enter the notes you would like to add, enter `clear` if you would like to clear the notes for the member",
          type: "string"
        }
        ],
      guildOnly: true,
    })
  }
  async run(message, { member, appendType, notes }) {
    const rosterMember = await Roster.findOne({ where: { discordID: member.id } })
    if (!rosterMember) {
      return message.say(`${member.tag} does not exist on the roster`)
    }
    if (notes == 'clear') {
      await Roster.update({ notes: '' }, { where: { discordID: member.id } })
      return message.say(`Notes for ${member.tag} have been cleared`)
    }
    if (appendType == 'append') {
      await Roster.update({ notes: rosterMember.notes + "\n" + notes }, { where: { discordID: member.id } })
      const embed = await new RichEmbed()
        .setColor(16522916)
        .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
        .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, member.avatarURL)
        .addField("Notes", `${rosterMember.notes + notes}`)
        .setTimestamp(Date.getDate)
      await message.say("Member modified:")
      return message.embed(embed)
      }
    if (appendType == 'overwrite') {
      await Roster.update({ notes: notes }, { where: { discordID: member.id } })
      const embed = await new RichEmbed()
        .setColor(16522916)
        .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
        .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, member.avatarURL)
        .addField("Notes", notes)
        .setTimestamp(Date.getDate)
      await message.say("Member modified:")
      return message.embed(embed)
      }
    

    }
  }
