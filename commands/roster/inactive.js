const { RichEmbed } = require("discord.js")
const { Command } = require("discord.js-commando")
module.exports = class Inactive extends Command {
  constructor(client) {
    super(client, {
      name: "inactive",
      group: "roster",
      memberName: "inactive",
      userPermissions: ['MANAGE_ROLES'],
      guildOnly: true,
      aliases: ['mark-inactive', 'toggle-inactive', 'toggleinactive', 'markinactive'],
      description: "For marking inactive members",
      args: [
        {
          key: "member",
          prompt: "Enter the member you want to toggle inactive on",
          type: "user",
        },
        {
          key: "dmedBy",
          prompt: "Enter who DMed them",
          type: 'user',
          default: ''
        }
        ]
    })
  }
  async run(message, { member, dmedBy }) {
      const NowDate = await new Date()
      let rosterMember = await Roster.findOne({ where: { discordID: member.id } })
      const newValue = await !rosterMember.inactive
      
      
      if (newValue == false) {
        await Roster.update({ inactive: false,  lastPost: "",  dmedBy: "" }, { where: { discordID: member.id }})
        rosterMember = await Roster.findOne({ where: { discordID: member.id } })
        const embed = await new RichEmbed()
          .setColor(16522916)
          .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
          .setTimestamp(Date.getDate)
          .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, member.avatarURL)
          .addField(`Inactive`, `❎`)
        
        await message.say("Member modified:")
        return message.embed(embed)
      } else {
        await Roster.update({ inactive: true }, { where: { discordID: member.id } })
        let lastPostDate = await ""
        let lastPostMessage = await ""
        if (message.guild.member(member).lastMessage == null) {
          lastPostMessage = await "No messages found"
        } else {
          lastPostDate = await message.guild.member(member).lastMessage.createdAt
          lastPostMessage = await `${lastPostDate.getMonth() + 1}/${lastPostDate.getDate()}` || "No message found"
        }
        await Roster.update({ lastPost: lastPostMessage }, { where: { discordID: member.id } })
        if (dmedBy == '') {
          await Roster.update({ dmedBy: message.author.tag }, { where: { discordID: member.id } })
        } else {
          await Roster.update({ dmedBy: dmedBy.tag }, { where: { discordID: member.id } })
        }
        rosterMember = await Roster.findOne({ where: { discordID: member.id } })
        const embed = await new RichEmbed()
          .setColor(16522916)
          .setFooter(`Edited by ${message.author.username}`, message.author.avatarURL)
          .setTimestamp(Date.getDate)
          .setAuthor(`${rosterMember.discordName} || ${rosterMember.discordID}`, member.avatarURL)
          .addField(`Inactive`, '✅', true)
          .addField('Last Post', `${rosterMember.lastPost}`, true)
          .addField('DMed by', `${rosterMember.dmedBy}`, true)
        await message.say("Member modified:")
        return message.embed(embed)
      }
        
      }
    }