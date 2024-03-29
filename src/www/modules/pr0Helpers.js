"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

const api = require("../../api/pr0Api");
const log = require("../../utils/logger");

/**
 * Promise based querying of pr0gramm account
 *
 * @param {String} name
 * @returns {Promise}
 */
const getPr0Account = function(name){
    return new Promise(resolve => {
        api.getUser(name, (err, res) => {
            if (err){
                log.error(err);
                return resolve(null);
            }
            return resolve(res.body);
        });
    });
};

/**
 * Promise based querying of pr0gramm username
 *
 * @param {String} uid
 * @returns {Promise}
 */
const getPr0Name = function(uid){
    return new Promise(resolve => {
        api.getPr0Username(uid, (err, res) => {
            if (err){
                log.error(err);
                return resolve(null);
            }
            return resolve(res.body);
        });
    });
};

/**
 * Promise based querying of discordId
 *
 * @param {String} username
 * @returns {Promise}
 */
const getDiscordId = function(username){
    return new Promise(resolve => {
        api.getDiscordId(username, (err, res) => {
            if (err){
                log.error(err);
                return resolve(null);
            }

            // Make sure the ID is a string.
            // Otherwise it might overflow as Number.
            return resolve(
                typeof res.body.discordId !== "string"
                    ? JSON.parse(res.raw_body.replace(/"discordId":(\d+),/g, '"discordId":"$1",'))
                    : res.body,
            );
        });
    });
};

module.exports = {
    getPr0Account,
    getPr0Name,
    getDiscordId,
};
