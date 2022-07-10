"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

const config = require("../../../utils/configHandler").getConfig();
const log = require("../../../utils/logger");

/**
 * Unset role for user
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
        message: !!req.session.user ? "Rolle wurde entfernt." : "Nicht authorisiert.",
    };

    if (!!req.session.user){
        if (!req.query.role){
            response.message = "Keine Rolle angegeben.";
            response.status = 400;
            response.error = 1;
        }

        else if (
            ![...config.rollen_auswahl, ...config.stammtisch_auswahl].includes(decodeURIComponent(String(req.query.role)))
        ){
            response.message = "Diese Rolle darf nicht entfernt werden.";
            response.status = 403;
            response.error = 1;
        }

        else {
            try {
                client.guilds.cache
                    .get(config.auth.server_id)?.members.cache
                    .get(req.session.user.id)?.roles
                    .remove(
                        client.guilds.cache
                            .get(config.auth.server_id)?.roles.cache
                            .find(r => r.name === decodeURIComponent(String(req.query.role))) || "",
                    ).catch();
            }
            catch (e){
                response.error = 1;
                response.status = 500;
                response.message = String(e);
                log.error(e);
            }
        }
    }

    return res.set({
        "Content-Type": "application/json; charset=utf-8",
    }).status(response.status).send(response);
};
