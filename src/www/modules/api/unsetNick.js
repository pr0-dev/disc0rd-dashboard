"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let config = require("../../../utils/configHandler").getConfig();

module.exports = async function(req, res, client){
    let response = {
        error: !!req.session.user ? 0 : 1,
        status: !!req.session.user ? 200 : 403,
        message: !!req.session.user ? "Nickname wurde entfernt." : "Nicht authorisiert."
    };

    if (!!req.session.user){
        try {
            client.guilds.cache
                .get(config.auth.server_id).members.cache
                .get(req.session.user.id)
                .setNickname("", "pr0 nick-desync");
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
