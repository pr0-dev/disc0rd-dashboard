"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let config = require("../../../utils/configHandler").getConfig();
let { getPr0Account, getPr0Name } = require("../pr0Helpers");

/**
 * Sync nick for user
 *
 * @param {import("express").Request & { session: Object }} req
 * @param {import("express").Response} res
 * @param {import("discord.js").Client} client
 * @returns {Promise<any>} JSON
 */
module.exports = async function(req, res, client){
    let response = {
        error: !!req.session.user ? 0 : 1,
        status: !!req.session.user ? 200 : 403,
        message: !!req.session.user ? "Nickname wurde gesetzt." : "Nicht authorisiert."
    };

    if (!!req.session.user){
        try {
            client.guilds.cache
                .get(config.auth.server_id).members.cache
                .get(req.session.user.id)
                .setNickname(
                    (await getPr0Account((await getPr0Name(req.session.user.id)).name)).user.name,
                    "pr0 nick-sync"
                ).then(() => {
                    client.guilds.cache
                        .get(config.auth.server_id).members.cache
                        .get(req.session.user.id).roles
                        .add(
                            client.guilds.cache
                                .get(config.auth.server_id).roles.cache
                                .find(r => r.name === config.bot_settings.verfied_nick_role)
                        );
                });
        }
        catch (e){
            response.error = 1;
            response.status = 500;
            response.message = String(e);
        }
    }

    return res.set({
        "Content-Type": "application/json; charset=utf-8"
    }).status(response.status).send(response);
};
