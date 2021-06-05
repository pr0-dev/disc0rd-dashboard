"use strict";

/* eslint-disable quote-props */

module.exports = {
    purge: [
        "./src/www/views/layouts/*.ejs",
        "./src/www/views/pages/*.ejs",
        "./src/www/views/errors/*.ejs",
        "./src/www/assets-built/css/*.css",
        "./src/www/assets/css/*.css",
        "./src/www/assets-built/js/*.js",
        "./src/www/assets/js/*.js"
    ],
    theme: {
        extend: {
            colors: {
                "dark": "rgb(47, 49, 54)",
                "discord-blue": "#7289DA",
                "discord-blue-dark": "#5566a3",
                "light": "#36393f"
            }
        }
    },
    variants: {},
    plugins: []
};
