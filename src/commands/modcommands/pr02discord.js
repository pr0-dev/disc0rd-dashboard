"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const config = require("../../utils/configHandler").getConfig();
const { getDiscordId } = require("../../www/modules/pr0Helpers");

/**
 * Resolves a pr0gramm username to it's discord ID
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {Array} args
 * @param {Function} callback
 * @returns {Promise<any>} callback
 */
exports.run = async(client, message, args, callback) => {
    if (!args.length) return callback("Du hast keinen pr0gramm Username angegeben.");

    const username = message.content.slice(`${config.bot_settings.prefix.command_prefix}discord2pr0 `.length);

    const pr0 = await getDiscordId(username);

    if (!pr0?.discordId) return callback("Diese Discord-ID ist mit keinem Account verknüpft.");

    message.channel.send(`Der pr0gramm Username \`${username}\` gehört zur Discord-ID \`${pr0.discordId}\` -> <@${pr0.discordId}>`);

    return callback();
};

exports.description = `Gibt die Discord-ID zu einem pr0gramm Usernamen aus. Verwendung: ${config.bot_settings.prefix.mod_prefix}pr02discord USERNAME`;
