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

/**
 * Handle the PWA-ishness of the main page
 *
 * @param {import("express").Request & { session: Object }} req
 * @param {import("express").Response} res
 * @returns {Promise<any>} renderer
 */
module.exports = async function(req, res){
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

    return res.render("pages/index", {
        "routeTitle": "Dashboard",
        "route": req.path,
        "user": req.session.user || null,
        "guilds": guilds,
        "dc": guildInfo,
        "config": config,
        "csrfToken": req.csrfToken(),
        "log": log,
        "pr0": pr0,
        "status_code": 200
    });
};
