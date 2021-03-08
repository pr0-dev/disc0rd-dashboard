"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Utils
let log = require("../utils/logger");
let config = require("../utils/configHandler").getConfig();

// Services
let getRoutes = require("./services/getRoutes");
let robotsHandler = require("./modules/robotsHandler");
let callbackHandler = require("./modules/callBackHandler");

// Routes
let setNick = require("./modules/api/setNick");
let unsetNick = require("./modules/api/unsetNick");
let getRoles = require("./modules/api/getRoles");
let setRole = require("./modules/api/setRole");
let unsetRole = require("./modules/api/unsetRole");
let indexHandler = require("./modules/indexHandler");
let notFoundHandler = require("./modules/404Handler");

const { clientId, scopes, redirectUri } = config.webserver.auth;
const authorizeUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes.join("%20")}`;

let checkAuth = (req, res, next) => (!req.session.user) ? res.redirect("/") : next();
let logRoutes = r => r.forEach(e => log.info(`Route ${e.path} registered with methods ${(e.methods).join(", ")}`));

/**
 * Main Router
 *
 * @param {import("express").Application} app
 * @param {import("discord.js").Client} client
 */
module.exports = function(app, client){
    app.get("/", async(req, res) => indexHandler(req, res));

    app.get("/callback", (req, res) => callbackHandler(req, res));

    // @ts-ignore
    app.get("/auth", (req, res) => res.redirect(!!req.session.user ? "/" : authorizeUrl));
    app.get("/logout", checkAuth, (req, res) => req.session.destroy(() => res.redirect("/")));

    app.get("/roles/get", (req, res) => getRoles(req, res, client));
    app.get("/roles/set", (req, res) => setRole(req, res, client));
    app.get("/roles/unset", (req, res) => unsetRole(req, res, client));

    app.get("/nick/set", (req, res) => setNick(req, res, client));
    app.get("/nick/unset", (req, res) => unsetNick(req, res, client));

    app.get("/robots.txt", robotsHandler);

    app.get("*", (req, res) => notFoundHandler(req, res));

    logRoutes(getRoutes(app));
};
