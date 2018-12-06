const { Command } = require("discord.js-commando");
module.exports = class RemoveMember extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-member',
      group: 'roster',
      memberName: 'remove-member',
      description: "Deletes a member from the roster (TESTING PURPOSES ONLY)",
      aliases: ['deletemember', 'delete-member', 'removemember'],
      guildOnly: true,
      args: [
        {
          key: 'memberToDelete',
          prompt: "Mention the member you would like to delete from the roster",
          type: 'user'
        }
        ]
    })
  }
  async run(message, { memberToDelete }) {
    const rowCount = await Roster.destroy({ where: { discordID: memberToDelete.id } })
    if (!rowCount) {
      return message.say(`${memberToDelete.tag} does not exist on the roster`)
    } else {
      return message.say(`${memberToDelete.tag} has been deleted from the roster`)
    }
  }
}