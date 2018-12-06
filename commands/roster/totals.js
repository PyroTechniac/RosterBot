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
    const pcATotal = await Roster.count({ where: { playsPC: true, clanInvitedTo: 'a', primarySystem: "PC" } })
    const pcETotal = await Roster.count({ where: { playsPC: true, clanInvitedTo: 'e', primarySystem: "PC" } })
    const ps4ATotal = await Roster.count({ where: { playsPS4: true, clanInvitedTo: 'a', primarySystem: "PS4" } })
    const ps4ETotal = await Roster.count({ where: { playsPS4: true, clanInvitedTo: 'e', primarySystem: "PS4" } })
    const xboxATotal = await Roster.count({ where: { playsXbox: true, clanInvitedTo: 'a', primarySystem: "XBOX" } })
    const xboxETotal = await Roster.count({ where: { playsXbox: true, clanInvitedTo: 'e', primarySystem: "XBOX" } })
    const pcAInactive = await Roster.count({ where: { playsPC: true, clanInvitedTo: 'a', inactive: true, primarySystem: "PC" } })
    const pcEInactive = await Roster.count({ where: { playsPC: true, clanInvitedTo: 'e', inactive: true, primarySystem: "PC" } })
    const ps4AInactive = await Roster.count({ where: { playsPS4: true, clanInvitedTo: 'a', inactive: true, primarySystem: "PS4" } })
    const ps4EInactive = await Roster.count({ where: { playsPS4: true, clanInvitedTo: 'e', inactive: true, primarySystem: "PS4" } })
    const xboxAInactive = await Roster.count({ where: { playsXbox: true, clanInvitedTo: 'a', inactive: true, primarySystem: 'XBOX' } })
    const xboxEInactive = await Roster.count({ where: { playsXbox: true, clanInvitedTo: 'e', inactive: true, primarySystem: "XBOX" } })
    const pcAActive = await Roster.count({ where: { playsPC: true, clanInvitedTo: 'a', inactive: false, gone: false, primarySystem: "PC" } })
    const pcEActive = await Roster.count({ where: { playsPC: true, clanInvitedTo: 'e', inactive: false, gone: false, primarySystem: "PC" } })
    const ps4AActive = await Roster.count({ where: { playsPS4: true, clanInvitedTo: 'a', inactive: false, gone: false, primarySystem: "PS4" } })
    const ps4EActive = await Roster.count({ where: { playsPS4: true, clanInvitedTo: 'e', inactive: false, gone: false, primarySystem: "PS4" } })
    const xboxAActive = await Roster.count({ where: { playsXbox: true, clanInvitedTo: 'a', inactive: false, gone: false, primarySystem: "XBOX" } })
    const xboxEActive = await Roster.count({ where: { playsXbox: true, clanInvitedTo: 'e', inactive: false, gone: false, primarySystem: "XBOX" } })
    const embed = await new RichEmbed()
      .setColor(16522916)
      .setAuthor("All totals, format is A/E")
      .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
      .setTimestamp(Date.getDate)
      .addField("<:pc:514135775818940417> Clan Totals", `${pcATotal}/${pcETotal}`, true)
      .addField("<:ps:514135745980661783> Clan Totals", `${ps4ATotal}/${ps4ETotal}`, true)
      .addField("<:xbox:514135718415695892> Clan Totals", `${xboxATotal}/${xboxETotal}`, true)
      .addField("<:pc:514135775818940417> Inactive Members", `${pcAInactive}/${pcEInactive}`, true)
      .addField("<:ps:514135745980661783> Inactive Members", `${ps4AInactive}/${ps4EInactive}`, true)
      .addField("<:xbox:514135718415695892> Inactive Members", `${xboxAInactive}/${xboxEInactive}`, true)
      .addField("<:pc:514135775818940417> Active Members", `${pcAActive}/${pcEActive}`, true)
      .addField("<:ps:514135745980661783> Active Members", `${ps4AActive}/${ps4EActive}`, true)
      .addField("<:xbox:514135718415695892> Active Members", `${xboxAActive}/${xboxEActive}`, true)
    
    await message.say("Totals: ")
    return message.embed(embed)
  }
}