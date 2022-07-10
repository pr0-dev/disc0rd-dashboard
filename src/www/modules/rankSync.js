"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

const config = require("../../utils/configHandler").getConfig();
const log = require("../../utils/logger");

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
        .get(config.auth.server_id)?.members
        .fetch()
        .then(guildMembers => guildMembers.get(user.id)
            ?.fetch()
            .then(fetchedUser => fetchedUser.roles.cache.map(role => role.id))
            .catch(e => log.error(e)),
        ).catch();

    if (userRoles?.includes(config.user_ranks[pr0.user.mark]) || pr0.user.mark === 16 || pr0.user.mark === 17) return false;

    try {
        // Remove all pr0-rank roles
        client.guilds.cache
            .get(config.auth.server_id)?.members.cache
            .get(user.id)?.roles.remove(Object.values(config.user_ranks)).then(() => {
                // Add appropriate pr0-rank role
                client.guilds.cache
                    .get(config.auth.server_id)?.members.cache
                    .get(user.id)?.roles
                    .add(
                        client.guilds.cache
                            .get(config.auth.server_id)?.roles.cache
                            .find(r => r.id === config.user_ranks[pr0.user.mark]) || "",
                    ).catch();
            }).catch();
    }

    catch (e){
        log.error(e);
        return false;
    }

    return true;
};
