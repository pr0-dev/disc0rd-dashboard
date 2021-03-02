"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

let config = require("../../utils/configHandler").getConfig();

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

    message.channel.send(`Der pr0gramm Username \`${username}\` gehört zur Discord-ID \`${null}\``);

    return callback();
};

exports.description = "Gibt die Discord-ID zu einem pr0gramm Usernamen aus.";
