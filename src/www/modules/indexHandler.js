"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Dependencies
let fetch = require("node-fetch");

// Utils
let log = require("../../utils/logger");
let config = require("../../utils/configHandler").getConfig();

let { getPr0Account, getPr0Name } = require("./pr0Helpers");
let rankSync = require("./rankSync");

/**
 * Handle the PWA-ishness of the main page
 *
 * @param {import("express").Request & { session: Object }} req
 * @param {import("express").Response} res
 * @param {import("discord.js").Client} client
 * @returns {Promise<void>} renderer
 */
module.exports = async function(req, res, client){
    let pr0 = !req.session.user
        ? null
        : await getPr0Account((await getPr0Name(req.session.user.id)).name);

    // @ts-ignore
    let guilds = !req.session.access_token ? null : await (await fetch("https://discordapp.com/api/users/@me/guilds", {
        headers: {
            authorization: `${req.session.token_type} ${req.session.access_token}`
        }
    })).json();

    // @ts-ignore
    let guildInfo = !guilds || !req.session.access_token ? null : await (await fetch(`https://discordapp.com/api/guilds/${config.auth.server_id}/members/${req.session.user.id}`, {
        headers: {
            authorization: `Bot ${config.auth.bot_token}`
        }
    })).json();

    let synced = await rankSync(pr0 || null, req.session.user || null, client);

    return res.render("pages/index", {
        "routeTitle": "Dashboard",
        "route": req.path,
        "user": req.session.user || null,
        "guilds": guilds,
        "dc": guildInfo,
        "config": config,
        "synced": synced,
        "csrfToken": req.csrfToken(),
        "log": log,
        "pr0": pr0,
        "status_code": 200
    });
};
