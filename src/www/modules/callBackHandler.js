"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let FormData = require("form-data");
let config = require("../../utils/configHandler").getConfig();
let fetch = require("node-fetch");

const { clientId, clientSecret, scopes, redirectUri } = config.webserver.auth;

module.exports = function(req, res){
    if (req.session.user) return res.redirect("/");

    const accessCode = req.query.code;
    if (!accessCode) return res.redirect("/");

    const data = new FormData();
    data.append("client_id", clientId);
    data.append("client_secret", clientSecret);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", redirectUri);
    data.append("scope", scopes.join(" "));
    data.append("code", accessCode);

    // @ts-ignore
    return fetch("https://discordapp.com/api/oauth2/token", { method: "POST", body: data })
        .then(response => response.json()).then(response => {
            // @ts-ignore
            fetch("https://discordapp.com/api/users/@me", {
                method: "GET",
                headers: {
                    authorization: `${response.token_type} ${response.access_token}`
                }
            }).then(res2 => res2.json()).then(userResponse => {
                userResponse.tag = `${userResponse.username}#${userResponse.discriminator}`;
                userResponse.avatarURL = userResponse.avatar ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png?size=1024` : null;
                req.session.user = userResponse;
                req.session.access_token = response.access_token;
                req.session.token_type = response.token_type;
                res.redirect("/");
            });
        });
};
