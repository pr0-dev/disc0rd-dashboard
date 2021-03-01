"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let env = process.env.NODE_ENV ?? "dev";
let nodev = process.version;
let osinfo = process.platform;

/**
 * Filter network devices / interfaces
 *
 * @param {string} dev
 * @param {any} ifaces
 * @returns {string} address
 */
let filterDevVal = function(dev, ifaces){
    let address;
    ifaces[dev].filter(details => {
        details.family === "IPv4" && details.internal === false ? address = details.address : undefined;
    });
    return address;
};

/**
 * Get internal IP
 *
 * @returns {string} IP
 */
let getIp = function(){
    let address;
    let ifaces = require("os").networkInterfaces();
    for (let dev in ifaces) address = filterDevVal(dev, ifaces);
    return address;
};

/**
 * Export info
 *
 * @param {Function} callback
 * @returns {any} callback
 */
module.exports = function(callback){
    let metadata = {};

    metadata.environment = env;
    metadata.nodeversion = nodev;
    metadata.os = osinfo;
    metadata.ip = getIp();

    return callback(metadata);
};
