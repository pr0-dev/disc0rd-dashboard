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
    let entry = (await message.guild.fetchAuditLogs({ type: 72 })).entries.first();

    let embed = {
        embed: {
            timestamp: moment.utc().format(),
            description: message.cleanContent + "\n\n\_\_\_\_\_",
            author: {
                // @ts-ignore
                name: `Nachricht von ${message.author.username} in ${message.channel.name} gelöscht`,
                icon_url: message.author.displayAvatarURL()
            },
            fields: [
                {
                    name: "Von User",
                    value: message.author.tag,
                    inline: true
                },
                {
                    name: "User ID",
                    value: message.author.id,
                    inline: true
                },
                {
                    // Empty field as separator
                    name: "\u200b",
                    value: "\u200b",
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
                    value: entry.target === message.author ? entry.executor : "Selbst",
                    inline: true
                },
                {
                    // Empty field as separator
                    name: "\u200b",
                    value: "\u200b",
                    inline: true
                }
            ]
        }
    };

    client.channels
        .fetch(config.bot_settings.deleted_log_id)
        .then(channel => /** @type {import("discord.js").TextChannel} */ (channel).send(embed));
};
