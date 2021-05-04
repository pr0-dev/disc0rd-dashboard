"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let config = require("../../../utils/configHandler").getConfig();

/**
 * Reset nickname for user
 *
 * @param {import("express").Request & { session: Object }} req
 * @param {import("express").Response} res
 * @param {import("discord.js").Client} client
 * @returns {Promise<any>} JSON
 */
module.exports = async function(req, res, client){
    let response = {
        error: !!req.session.user ? 0 : 1,
        status: !!req.session.user ? 200 : 401,
        message: !!req.session.user ? "Nickname wurde entfernt." : "Nicht authorisiert."
    };

    if (!!req.session.user){
        try {
            client.guilds.cache
                .get(config.auth.server_id).members.cache
                .get(req.session.user.id)
                .setNickname("", "pr0 nick-desync")
                .then(() => {
                    client.guilds.cache
                        .get(config.auth.server_id).members.cache
                        .get(req.session.user.id).roles
                        .remove(
                            client.guilds.cache
                                .get(config.auth.server_id).roles.cache
                                .find(r => r.id === config.bot_settings.verfied_nick_role)
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
