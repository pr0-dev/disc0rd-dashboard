"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Dependencies
let fetch = require("node-fetch");
let FormData = require("form-data");

// Utils
let log = require("../utils/logger");
let config = require("../utils/configHandler").getConfig();

// Services
let getRoutes = require("./services/getRoutes");
let robotsHandler = require("./modules/robotsHandler");
let { getPr0Account, getPr0Name } = require("./modules/pr0Helpers");

// Routes
let setNick = require("./modules/api/setNick");
let unsetNick = require("./modules/api/unsetNick");
let getRoles = require("./modules/api/getRoles");

const { clientId, clientSecret, scopes, redirectUri } = config.webserver.auth;
const authorizeUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes.join("%20")}`;

let routes;

let checkAuth = (req, res, next) => (!req.session.user) ? res.redirect("/") : next();

module.exports = function(app, client){
    app.get("/", async(req, res) => {
        let pr0 = !req.session.user
            ? null
            : await getPr0Account((await getPr0Name(req.session.user.id)).name);

        // @ts-ignore
        let guilds = !req.session.access_token ? null : await (await fetch("https://discordapp.com/api/users/@me/guilds", {
            headers: {
                authorization: `${req.session.token_type} ${req.session.access_token}`
            }
        })).json();

        // @ts-ignore
        let guildInfo = !guilds || !req.session.access_token ? null : await (await fetch(`https://discordapp.com/api/guilds/${config.auth.server_id}/members/${req.session.user.id}`, {
            headers: {
                authorization: `Bot ${config.auth.bot_token}`
            }
        })).json();

        return res.render("pages/index", {
            "routeTitle": "Dashboard",
            "route": req.path,
            "user": req.session.user || null,
            "guilds": guilds,
            "dc": guildInfo,
            "config": config,
            "csrfToken": req.csrfToken(),
            "log": log,
            "pr0": pr0
        });
    });

    // Auth
    app.get("/callback", (req, res) => {
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
        return fetch("https://discordapp.com/api/oauth2/token", {
            method: "POST",
            body: data
        }).then(response => response.json()).then(response => {
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
    });

    app.get("/auth", (req, res) => res.redirect(!!req.session.user ? "/" : authorizeUrl));
    app.get("/logout", checkAuth, (req, res) => req.session.destroy(() => res.redirect("/")));
    app.get("/roles/get", (req, res) => getRoles(req, res, client));
    app.get("/nick/set", (req, res) => setNick(req, res, client));
    app.get("/nick/unset", (req, res) => unsetNick(req, res, client));
    app.get("/robots.txt", robotsHandler);

    // Errors
    app.get("*", (req, res) => {
        res.render("errors/404", {
            "routeTitle": "Nicht gefunden :(",
            "route": req.path,
        });
    });

    routes = getRoutes(app);
    for (let i in routes){
        log.info(`Route ${routes[i].path} registered with methods ${(routes[i].methods).join(", ")}`);
    }
};
