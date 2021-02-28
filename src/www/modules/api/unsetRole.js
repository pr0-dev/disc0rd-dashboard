"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let config = require("../../../utils/configHandler").getConfig();

module.exports = async function(req, res, client){
    let response = {
        error: !!req.session.user ? 0 : 1,
        status: !!req.session.user ? 200 : 403,
        message: !!req.session.user ? "Rolle wurde entfernt." : "Nicht authorisiert."
    };

    if (!!req.session.user){
        if (!req.query.role){
            response.message = "Keine Rolle angegeben.";
            response.error = 1;
        }
        else if (!config.rollen_auswahl.includes(req.query.role)) {
            response.message = "Diese Rolle darf nicht entfernt werden.";
            response.error = 1;
        }
        else {
            try {
                client.guilds.cache
                    .get(config.auth.server_id).members.cache
                    .get(req.session.user.id).roles
                    .remove(
                        client.guilds.cache
                            .get(config.auth.server_id).roles.cache
                            .find(r => r.name === decodeURIComponent(req.query.role))
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
