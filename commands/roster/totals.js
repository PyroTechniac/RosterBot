const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
module.exports = class Totals extends Command {
  constructor(client) {
    super(client, {
      name: "totals",
      group: "roster",
      memberName: "totals",
      description: "For getting all the totals of the roster",
      guildOnly: true,
      userPermissions: ['MANAGE_ROLES']
    })
  }
  async run(message) {
    //const
    
    
    const embed = await new RichEmbed()
  }
}