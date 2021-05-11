"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Dependencies
let moment = require("moment");

// Utils
let config = require("../utils/configHandler").getConfig();

/**
 * Log deleted messages
 *
 * @param {import("discord.js").Message | import("discord.js").PartialMessage} message
 * @param {import("discord.js").Client} client
 */
module.exports = async function(message, client){
    // Don't log deleted entries in the deleted-log channel
    if (message.channel.id === config.bot_settings.deleted_log_id) return;

    let entry = (await message.guild.fetchAuditLogs({ type: 72 })).entries.first();

    // Don't log entries that have been deleted by the initial author (Data Privacy)
    if (config.is_production && entry.target !== message.author) return;
    let target = entry.target === message.author ? entry.executor : "Selbst"; // <- dev-mode only

    let embed = {
        embed: {
            timestamp: moment.utc().format(),
            description: message.cleanContent + "\n\n\- - - - -",
            author: {
                // @ts-ignore
                name: `Nachricht von ${message.author.username} in ${message.channel.name} gelöscht`,
                icon_url: message.author.displayAvatarURL()
            },
            fields: [
                {
                    name: "Von User",
                    value: message.author,
                    inline: true
                },
                {
                    name: "User Tag",
                    value: message.author.tag,
                    inline: true
                },
                {
                    name: "User ID",
                    value: message.author.id,
                    inline: true
                },
                {
                    name: "In Channel",
                    // @ts-ignore
                    value: message.channel.name,
                    inline: true
                },
                {
                    name: "Gelöscht von",
                    value: target,
                    inline: true
                },
                {
                    name: "Datum/Zeit",
                    value: String(moment().format("DD.MM.YYYY HH:mm:ss")),
                    inline: true
                }
            ]
        }
    };

    client.channels
        .fetch(config.bot_settings.deleted_log_id)
        .then(channel => /** @type {import("discord.js").TextChannel} */ (channel).send(embed));
};
