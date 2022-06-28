"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

const env = process.env.NODE_ENV ?? "dev";
const nodev = process.version;
const osinfo = process.platform;

/**
 * Filter network devices / interfaces
 *
 * @param {string} dev
 * @param {any} ifaces
 * @returns {string} address
 */
const filterDevVal = function(dev, ifaces){
    let address;
    // eslint-disable-next-line prefer-destructuring
    ifaces[dev].filter(details => (details.family === "IPv4" && details.internal === false ? (address = details.address) : undefined));
    return address || "";
};

/**
 * Get internal IP
 *
 * @returns {string} IP
 */
const getIp = function(){
    let address;
    const ifaces = require("os").networkInterfaces();
    for (const dev in ifaces) address = filterDevVal(dev, ifaces);
    return address || "";
};

/**
 * Export info
 *
 * @param {Function} callback
 * @returns {any} callback
 */
module.exports = function(callback){
    const metadata = {};

    metadata.environment = env;
    metadata.nodeversion = nodev;
    metadata.os = osinfo;
    metadata.ip = getIp();

    return callback(metadata);
};
