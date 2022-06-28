"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Dependencies
const moment = require("moment");

// Utils
const config = require("../utils/configHandler").getConfig();

const WATCHER_SET = new Set();

/**
 * Handles incomming messages
 *
 * @param {import("discord.js").Message} message
 * @param {import("discord.js").Client} client
 */
module.exports = async function(message, client){
    if (/free/gi.test(message.content) && /nitro/gi.test(message.content) && /(https|http|www|com|tk|ml|cf)/gi.test(message.content)){
        message.delete({ reason: "Possible Nitro Spam Link" });

        if (WATCHER_SET.has(message.author.id)){
            WATCHER_SET.delete(message.author.id);

            message.author.send("Du wurdest wegen spam vom pr0gramm Disc0rd verbannt. Wenn du denkst, dass das ein Fehler war, melde dich bitte an ShadowByte#1337");

            (await message.guild.members.fetch(message.author.id)).ban(({ days: 7, reason: "Possible nitro spam detected (second offense)" }));

            const embed = {
                embed: {
                    timestamp: moment.utc().format(),
                    description: message.cleanContent + "\n\n\- - - - -",
                    author: {
                        name: `User ${message.author.username} wurde wegen Nitro-Spam gebannt.`,
                        icon_url: message.author.displayAvatarURL()
                    },
                    fields: [
                        { name: "Von User", value: message.author, inline: true },
                        { name: "User Tag", value: message.author.tag, inline: true },
                        { name: "User ID", value: message.author.id, inline: true },
                        { name: "Datum/Zeit", value: String(moment().format("DD.MM.YYYY HH:mm:ss")), inline: true }
                    ]
                }
            };

            client.channels
                .fetch(config.bot_settings.deleted_log_id)
                .then(channel => /** @type {import("discord.js").TextChannel} */ (channel).send(/** @type {Object} */ (embed)));
        }
        else WATCHER_SET.add(message.author.id);
    }
};
