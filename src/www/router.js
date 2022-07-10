"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Utils
const log = require("../utils/logger");
const config = require("../utils/configHandler").getConfig();

// Services
const getRoutes = require("./services/getRoutes");
const robotsHandler = require("./modules/robotsHandler");
const callbackHandler = require("./modules/callBackHandler");

// Routes
const setNick = require("./modules/api/setNick");
const unsetNick = require("./modules/api/unsetNick");
const getRoles = require("./modules/api/getRoles");
const setRole = require("./modules/api/setRole");
const unsetRole = require("./modules/api/unsetRole");
const indexHandler = require("./modules/indexHandler");
const notFoundHandler = require("./modules/404Handler");

const { clientId, scopes, redirectUri } = config.webserver.auth;
const authorizeUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes.join("%20")}`;

const checkAuth = (req, res, next) => (!req.session.user) ? res.redirect("/") : next();
const logRoutes = r => r.forEach(e => log.info(`Route ${e.path} registered with methods ${(e.methods).join(", ")}`));

/**
 * Main Router
 *
 * @param {import("express").Application} app
 * @param {import("discord.js").Client} client
 */
module.exports = function(app, client){
    app.get("/", async(req, res) => indexHandler(req, res, client));

    app.get("/callback", (req, res) => callbackHandler(req, res));

    app.get("/auth", (req, res) => res.redirect(!! /** @type {object} */ (req.session).user ? "/" : authorizeUrl));
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
