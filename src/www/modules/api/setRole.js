"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

const config = require("../../../utils/configHandler").getConfig();

/**
 * Check if the user already has too many roles
 *
 * @param {import("discord.js").Client} client
 * @param {import("express").Request & { session: Object }} req
 * @return {boolean}
 */
const userHasTooManyRoles = function(client, req){
    return (
        config.stammtisch_auswahl.filter(v => client.guilds.cache
            .get(config.auth.server_id).members.cache
            .get(req.session.user.id).roles.cache
            .array()
            .map(e => e.name)
            .includes(v)
        ).length >= Number(config.max_stammtisch_roles)
    );
};

/**
 * Set role for user
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
        message: !!req.session.user ? "Rolle wurde hinzugefügt." : "Nicht authorisiert."
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
            response.message = "Diese Rolle darf nicht gesetzt werden.";
            response.status = 403;
            response.error = 1;
        }

        else if (userHasTooManyRoles(client, req)){
            response.message = `Du kannst nicht mehr als ${config.max_stammtisch_roles} Stammtischrollen setzen.`;
            response.status = 403;
            response.error = 1;
        }

        else {
            try {
                client.guilds.cache
                    .get(config.auth.server_id).members.cache
                    .get(req.session.user.id).roles
                    .add(
                        client.guilds.cache
                            .get(config.auth.server_id).roles.cache
                            .find(r => r.name === decodeURIComponent(String(req.query.role)))
                    );
            }
            catch (e){
                response.error = 1;
                response.status = 500;
                response.message = String(e);
            }
        }
    }

    return res.set({
        "Content-Type": "application/json; charset=utf-8"
    }).status(response.status).send(response);
};
