"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/**
 * Send the user an invite to the server
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {Array} args
 * @param {Function} callback
 * @returns {Function} callback
 */
exports.run = (client, message, args, callback) => {
    message.react("✉");
    message.author.send("Invite Link: https://discord.pr0gramm.com");

    return callback();
};

exports.description = "Sendet einen Invite link für den Server.";
