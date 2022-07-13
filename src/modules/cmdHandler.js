"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").Client} Client
 */

// Core Modules
const fs = require("fs");
const path = require("path");

// Utils
const log = require("../utils/logger");
const config = require("../utils/configHandler").getConfig();

/**
 * Passes commands to the correct executor
 *
 * @param {Message} message
 * @param {Client} client
 * @param {boolean} isModCommand
 * @param {Function} callback
 * @returns {Function} callback
 */
const commandHandler = function(message, client, isModCommand, callback){
    const cmdPrefix = isModCommand ? config.bot_settings.prefix.mod_prefix : config.bot_settings.prefix.command_prefix;
    const args = message.content.slice(cmdPrefix.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase() || "";

    const commandArr = [];
    const commandDir = isModCommand ? path.resolve("./src/commands/modcommands") : path.resolve("./src/commands");

    fs.readdirSync(commandDir).forEach(file => {
        const cmdPath = path.resolve(commandDir, file);
        const stats = fs.statSync(cmdPath);
        if (!stats.isDirectory()) commandArr.push(file.toLowerCase());
    });

    if (!commandArr.includes(command.toLowerCase() + ".js")){
        return callback();
    }

    if (isModCommand && !message.member?.roles?.cache.some(r => config.bot_settings.moderator_roles.includes(r.name))){
        log.warn(`User "${message.author.tag}" (${message.author}) versuchte mod command "${cmdPrefix}${command}" auszuführen und wurde verweigert.`);

        return callback(
            `Tut mir leid, ${message.author}. Du hast nicht genügend Rechte um dieses Command zu verwenden =(`,
        );
    }

    log.info(
        `User "${message.author.tag}" (${message.author}) performed ${(isModCommand ? "mod-" : "")}command: ${cmdPrefix}${command}`,
    );

    const cmdHandle = require(path.join(commandDir, command));

    try {
        cmdHandle.run(client, message, args, function(err){
            // Non-Exception Error returned by the command (e.g.: Missing Argument)
            if (err) callback(err);
        });
    }

    // Exception returned by the command handler
    catch (err){
        callback(
            "Sorry, irgendwas ist schief gegangen! =(",
        );
        log.error(err);
    }

    return callback();
};

module.exports = commandHandler;
