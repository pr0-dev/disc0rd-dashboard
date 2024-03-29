"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/**
 * Render the 404 Page
 *
 * @param {import("express").Request & { session: Object}} req
 * @param {import("express").Response} res
 * @returns {any} renderer
 */
module.exports = function(req, res){
    return res.status(404).render("errors/404", {
        routeTitle: "404 - Nicht gefunden =(",
        route: req.path,
        user: req.session.user || null,
        guilds: null,
        dc: null,
        config: null,
        synced: false,
        csrfToken: req.csrfToken(),
        log: null,
        pr0: null,
        status_code: 404,
    });
};
