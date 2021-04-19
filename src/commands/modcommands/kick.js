"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let config = require("../../utils/configHandler").getConfig();

/**
 * Kicks a user with reason
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {Array} args
 * @param {Function} callback
 * @returns {Function} callback
 */
exports.run = (client, message, args, callback) => {
    let mentioned = message.mentions?.users?.first?.();
    let reason = args.slice(1).join(" ");

    if (!mentioned) return callback(`Es wurde kein Username angegeben. Verwendung: \`${config.bot_settings.prefix.mod_prefix}kick \@username KICKGRUND\``);
    if (!reason) return callback(`Das Kick-Command erfordert einen Kick-Grund. Verwendung: \`${config.bot_settings.prefix.mod_prefix}kick \@username KICKGRUND\``);

    let mentionedUserObject = message.guild.member(mentioned);

    if (!mentionedUserObject.kickable) return callback("Dieser User kann nicht gekickt werden.");

    message.channel.send(`User ${mentionedUserObject} wurde gekickt!\nGrund: ${reason}`);
    message.guild.member(mentioned).send(`
Du wurdest vom pr0gramm disc0rd gekickt.
Grund: ${reason}

Du kannst dies als Verwarnung betrachten. Das nächste mal könnte es bereits ein Ban sein.
`
    );

    mentionedUserObject.kick(String(reason));

    return callback();
};

exports.description = `Kickt einen User mit Grund (wird an User per PN gesendet). Verwendung: ${config.bot_settings.prefix.mod_prefix}kick \@username KICKGRUND`;
