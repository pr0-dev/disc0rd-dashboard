"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/**
 * Shows some generic infos
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {Array} args
 * @param {Function} callback
 * @returns {Function} callback
 */
exports.run = (client, message, args, callback) => {
    message.react("✉");
    message.author.send(
        "Programmiert von ShadowByte#1337 (TheShad0w) für den pr0gramm disc0rd (<https://discord.pr0gramm.com>)\n\n" +
        "Eckdaten:\n" +
        "- Programmiersprache: NodeJS\n" +
        "- NodeJS Version: " + process.version + "\n" +
        "- PID: " + process.pid + "\n" +
        "- Uptime (seconds): " + Math.floor(process.uptime()) + "\n" +
        "- Platform: " + process.platform + "\n" +
        "- System CPU usage time: " + process.cpuUsage().system + "\n" +
        "- User CPU usage time: " + process.cpuUsage().user + "\n" +
        "- Architecture: " + process.arch + "\n\n" +
        "Source Code: <https://github.com/pr0-dev/disc0rd-dashboard>"
    );

    return callback();
};

exports.description = "Listet informationen über diesen Bot.";
