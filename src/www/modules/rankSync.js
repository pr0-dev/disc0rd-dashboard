"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

let config = require("../../utils/configHandler").getConfig();

/**
 * Auto-Sync pr0 and discord rank
 *
 * @param {Object} pr0
 * @param {Object} user
 * @param {import("discord.js").Client} client
 * @return {Promise<boolean>} synced
 */
module.exports = async function(pr0, user, client){
    if (!pr0 || !user) return false;

    const userRoles = await client.guilds.cache
        .get(config.auth.server_id).members
        .fetch()
        .then(guildMembers => guildMembers.get(user.id)
            .fetch()
            .then(fetchedUser => fetchedUser.roles.cache.map(role => role.id))
        );

    if (userRoles.includes(config.user_ranks[pr0.user.mark])) return false;

    // TODO: Remove all other roles

    client.guilds.cache
        .get(config.auth.server_id).members.cache
        .get(user.id).roles
        .add(
            client.guilds.cache
                .get(config.auth.server_id).roles.cache
                .find(r => r.id === config.user_ranks[pr0.user.mark])
        );

    return true;
};