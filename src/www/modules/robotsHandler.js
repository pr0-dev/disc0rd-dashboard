"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

const author = require("../../utils/configHandler").getAuthor();

/**
 * Generate robots.txt
 *
 * @param {import("express").Request} _
 * @param {import("express").Response} res
 */
module.exports = function(_, res){
    let cYear = (new Date()).getFullYear();

    res.type("text/plain");
    res.send(
        "#" + "-".repeat(17 + cYear.toString().length + author.length) + "#\n" +
        "# Copyright (c) " + cYear + " " + author + " #\n" +
        "#" + "-".repeat(17 + cYear.toString().length + author.length) + "#\n\n" +
        "User-agent: *\n" +
        "Disallow: /css\n" +
        "Disallow: /img\n" +
        "Disallow: /js\n" +
        "Disallow: /lib\n\n" +
        "User-agent: Mediapartners-Google\n" +
        "Disallow: /\n\n" +
        "User-agent: Spinn3r\n" +
        "Disallow: /\n\n" +
        "User-agent: 008\n" +
        "Disallow: /\n\n" +
        "User-agent: voltron\n" +
        "Disallow: /\n\n" +
        "User-agent: Yahoo Pipes 1.0\n" +
        "Disallow: /\n\n" +
        "User-agent: KSCrawler\n" +
        "Disallow: /\n"
    );
};
