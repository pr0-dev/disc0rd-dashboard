"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Dependencies
let fetch = require("node-fetch");

// Utils
let log = require("../utils/logger");
let config = require("../utils/configHandler").getConfig();

// Services
let getRoutes = require("./services/getRoutes");
let robotsHandler = require("./modules/robotsHandler");
let { getPr0Account, getPr0Name } = require("./modules/pr0Helpers");
let callbackHandler = require("./modules/callBackHandler");

// Routes
let setNick = require("./modules/api/setNick");
let unsetNick = require("./modules/api/unsetNick");
let getRoles = require("./modules/api/getRoles");
let setRole = require("./modules/api/setRole");
let unsetRole = require("./modules/api/unsetRole");

const { clientId, scopes, redirectUri } = config.webserver.auth;
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

    app.get("/callback", (req, res) => callbackHandler(req, res));
    app.get("/auth", (req, res) => res.redirect(!!req.session.user ? "/" : authorizeUrl));
    app.get("/logout", checkAuth, (req, res) => req.session.destroy(() => res.redirect("/")));

    app.get("/roles/get", (req, res) => getRoles(req, res, client));
    app.get("/roles/set", (req, res) => setRole(req, res, client));
    app.get("/roles/unset", (req, res) => unsetRole(req, res, client));

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
