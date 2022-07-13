"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

const config = require("../../../utils/configHandler").getConfig();
const log = require("../../../utils/logger");
const { getPr0Account, getPr0Name } = require("../pr0Helpers");

/**
 * Sync nick for user
 *
 * @param {import("express").Request & { session: Object }} req
 * @param {import("express").Response} res
 * @param {import("discord.js").Client} client
 * @returns {Promise<any>} JSON
 */
module.exports = async function(req, res, client){
    const response = {
        error: !!req.session.user ? 0 : 1,
        status: !!req.session.user ? 200 : 401,
        message: !!req.session.user ? "Nickname wurde gesetzt." : "Nicht authorisiert.",
    };

    if (!!req.session.user){
        try {
            client.guilds?.cache
                .get(config.auth.server_id)?.members?.cache
                .get(req.session.user.id)
                ?.setNickname(
                    (await getPr0Account((await getPr0Name(req.session.user.id)).name)).user.name,
                    "pr0 nick-sync",
                ).catch().then(() => {
                    client.guilds?.cache
                        .get(config.auth.server_id)?.members?.cache
                        .get(req.session.user.id)?.roles
                        .add(
                            client.guilds?.cache
                                .get(config.auth.server_id)?.roles?.cache
                                .find(r => r.id === config.bot_settings.verfied_nick_role) || "",
                        ).catch();
                }).catch();
        }
        catch (e){
            response.error = 1;
            response.status = 500;
            response.message = String(e);
            log.error(e);
        }
    }

    return res.set({
        "Content-Type": "application/json; charset=utf-8",
    }).status(response.status).send(response);
};
