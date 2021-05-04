"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let config = require("../../../utils/configHandler").getConfig();

/**
 * Get matching roles from discord server
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
        message: !!req.session.user ? "Erfolgreich." : "Nicht authorisiert."
    };

    if (!!req.session.user){
        const finalRoles = [];
        const configRoles = config.rollen_auswahl;

        const userRoles = await client.guilds.cache
            .get(config.auth.server_id).members
            .fetch()
            .then(guildMembers => guildMembers.get(req.session.user.id)
                .fetch()
                .then(fetchedUser => fetchedUser.roles.cache.map(role => role.name))
            );

        await client.guilds.cache
            .get(config.auth.server_id)
            .fetch()
            .then(async fetched => (await fetched.roles
                .fetch()
                .then(fetchedRoles => (fetchedRoles.cache
                    .map(role => role.name)
                    .filter(role => configRoles.includes(role))
                    .forEach(e => finalRoles.push({
                        role: e,
                        on_user: userRoles.includes(e)
                    }))
                ))
            ));

        response.roles = finalRoles;
    }

    return res.set({
        "Content-Type": "application/json; charset=utf-8"
    }).status(response.status).send(response);
};
