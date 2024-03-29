"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Core Modules
const fs = require("fs");
const path = require("path");

// Utils
const config = require("../../utils/configHandler").getConfig();

/**
 * Enlists all mod-commands with descriptions
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {Array} args
 * @param {Function} callback
 * @returns {Function} callback
 */
exports.run = (client, message, args, callback) => {
    const commandObj = {};
    const commandDir = path.resolve("./src/commands/modcommands");

    fs.readdirSync(commandDir).forEach(file => {
        const cmdPath = path.resolve(commandDir, file);
        const stats = fs.statSync(cmdPath);

        if (!stats.isDirectory()){
            // Prefix + Command name
            const commandStr = config.bot_settings.prefix.mod_prefix + file.toLowerCase().replace(/\.js/gi, "");

            // commandStr is the key and the description of the command is the value
            commandObj[commandStr] = require(path.join(commandDir, file)).description;
        }
    });

    let commandText = "";
    for (const i in commandObj){
        commandText += i;
        commandText += ":\n";
        commandText += commandObj[i];
        commandText += "\n\n";
    }

    // Add :envelope: reaction to authors message
    message.react("✉").catch();
    message.author.send(
        "Hallo, " + message.author.username + "!\n\n" +
        "Hier ist eine Liste mit commands:\n\n```yml\n" +
        commandText +
        "``` \n\n" +
        "Bei fragen kannst du dich an @ShadowByte#1337 wenden!",
    ).catch();

    return callback();
};

exports.description = "Listet alle mod commands auf.";
