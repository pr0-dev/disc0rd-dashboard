"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").Client} Client
 */

// Utils
const config = require("../utils/configHandler").getConfig();

// Handler
const cmdHandler = require("./cmdHandler");

/**
 * Handles incomming messages
 *
 * @param {Message} message
 * @param {Client} client
 * @returns {Function | undefined} callback
 */
module.exports = function(message, client){
    const nonBiased = message.content
        .replace(config.bot_settings.prefix.command_prefix, "")
        .replace(config.bot_settings.prefix.mod_prefix, "")
        .replace(/\s/g, "");

    if (message.author.bot || nonBiased === "" || String(message.channel.type).toLowerCase() === "dm") return;

    /**
     * cmdHandler Parameters:
     *
     * @param {Message} message
     * @param {Client} client
     * @param {boolean} isModCommand
     * @param {Function} callback
     */
    if (message.content.indexOf(config.bot_settings.prefix.command_prefix) === 0){
        cmdHandler(message, client, false, (err) => (err && message.channel.send(err).catch()));
    }

    else if (message.content.indexOf(config.bot_settings.prefix.mod_prefix) === 0){
        cmdHandler(message, client, true, (err) => (err && message.channel.send(err).catch()));
    }

    else return;
};
