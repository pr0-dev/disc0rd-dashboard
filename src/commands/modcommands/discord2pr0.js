"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

let config = require("../../utils/configHandler").getConfig();
let { getPr0Name } = require("../../www/modules/pr0Helpers");

/**
 * Resolves a discord ID to it's pr0gramm username
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {Array} args
 * @param {Function} callback
 * @returns {Promise<any>} callback
 */
exports.run = async(client, message, args, callback) => {
    if (!args.length) return callback("Du hast keine ID angegeben.");

    let uid = message.content.slice(`${config.bot_settings.prefix.command_prefix}discord2pr0 `.length);

    // @ts-ignore
    if (isNaN(uid)) return callback(`Das Input \`${uid}\` scheint keine gültige Discord-ID zu sein.`);

    let pr0 = await getPr0Name(uid);

    if (!pr0?.name) return callback("Diese Discord-ID ist mit keinem Account verknüpft.");
    message.channel.send(`Die Discord-ID \`${uid}\` gehört zum Account \`${pr0.name}\` -> <https://pr0gramm.com/user/${pr0.name}>`);

    return callback();
};

exports.description = `Gibt den pr0gramm Usernamen zu einer Discord-ID aus. Verwendung: ${config.bot_settings.prefix.mod_prefix}discord2pr0 DISCORD_ID`;
