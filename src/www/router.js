"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Utils
let log = require("../utils/logger");

// Services
let getRoutes = require("./services/getRoutes");
let robotsHandler = require("./modules/robotsHandler");

let routes;

module.exports = function(app){
    app.get("/", (req, res) => {
        res.render("pages/index", {
            "routeTitle": "Dashboard",
            "route": req.path,
        });
    });

    // Handler
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
