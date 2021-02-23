"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let api = require("../../api/pr0Api");
let log = require("../../utils/logger");

let getPr0Account = function(name){
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

let getPr0Name = function(uid){
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

module.exports = {
    getPr0Account,
    getPr0Name
};
