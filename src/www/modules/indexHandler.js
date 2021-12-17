"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Dependencies
let fetch = require("node-fetch").default;

// Utils
let log = require("../../utils/logger");
let config = require("../../utils/configHandler").getConfig();

let { getPr0Account, getPr0Name } = require("./pr0Helpers");
let rankSync = require("./rankSync");

let panic = function(error, req, res){
    log.error(error);
    req.session.destroy();
    return res.status(500).render("errors/500", {
        config: null,
        log: null,
        error_stack: error,
        routeTitle: "500 - Server Fehler =(",
        route: req.path,
        user: req.session.user || null,
        csrfToken: req.csrfToken(),
        status_code: 500,
        guilds: null,
        dc: null,
        synced: false,
        pr0: null
    });
};

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

    if (!!req.session.user && !pr0) return panic("fetchPr0Account returned null or undefined.", req, res);

    let guilds = !req.session.access_token ? null : await (await fetch("https://discordapp.com/api/users/@me/guilds", {
        headers: {
            authorization: `${req.session.token_type} ${req.session.access_token}`
        }
    })).json();

    let guildInfo = !guilds || !req.session.access_token ? null : await (await fetch(`https://discordapp.com/api/guilds/${config.auth.server_id}/members/${req.session.user.id}`, {
        headers: {
            authorization: `Bot ${config.auth.bot_token}`
        }
    })).json();

    let synced = await rankSync(pr0 || null, req.session.user || null, client);

    return res.render("pages/index", {
        guilds,
        config,
        synced,
        log,
        pr0,
        routeTitle: "Dashboard",
        route: req.path,
        user: req.session.user || null,
        dc: guildInfo,
        csrfToken: req.csrfToken(),
        status_code: 200
    });
};
