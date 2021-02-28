"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let config = require("../../../utils/configHandler").getConfig();

module.exports = async function(req, res, client){
    let response = {
        error: !!req.session.user ? 0 : 1,
        status: !!req.session.user ? 200 : 403,
        message: !!req.session.user ? "Erfolgreich." : "Nicht authorisiert."
    };

    if (!!req.session.user){
        const finalRoles = [];
        const configRoles = config.rollen_auswahl;

        const userRoles = client.guilds.cache
            .get(config.auth.server_id).members.cache
            .get(req.session.user.id).roles.cache
            .map(role => role.name);

        client.guilds.cache
            .get(config.auth.server_id).roles.cache
            .map(role => role.name)
            .filter(role => configRoles.includes(role))
            .forEach(e => finalRoles.push({
                "role": e,
                "on_user": userRoles.includes(e)
            }));

        response.roles = finalRoles;
    }

    return res.set({
        "Content-Type": "application/json; charset=utf-8"
    }).status(response.status).send(response);
};
