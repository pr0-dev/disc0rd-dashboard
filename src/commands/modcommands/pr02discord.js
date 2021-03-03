"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

let config = require("../../utils/configHandler").getConfig();
let { getDiscordId } = require("../../www/modules/pr0Helpers");

/**
 * Shows some generic infos
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {Array} args
 * @param {Function} callback
 * @returns {Promise<any>} callback
 */
exports.run = async(client, message, args, callback) => {
    if (!args.length) return callback("Du hast keinen pr0gramm Username angegeben.");

    let username = message.content.slice(`${config.bot_settings.prefix.command_prefix}discord2pr0 `.length);

    let pr0 = await getDiscordId(username);

    if (!pr0?.discordId) return callback("Diese Discord-ID ist mit keinem Account verknüpft.");

    message.channel.send(`Der pr0gramm Username \`${username}\` gehört zur Discord-ID \`${pr0.discordId}\` -> <@${pr0.discordId}>`);

    return callback();
};

exports.description = "Gibt die Discord-ID zu einem pr0gramm Usernamen aus.";
