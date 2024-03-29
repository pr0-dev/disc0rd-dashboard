"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

(($, SA) => {
    /**
     * Set/Remove Nickname
     *
     * @param {Event & { target: HTMLInputElement }} e
     * @param {boolean} [force=false]
     * @returns {Promise<void>}
     */
    const handleNickChange = async function(e, force = false){
        const res = await (await fetch(
            (force || e.target.checked)
                ? "/nick/set"
                : "/nick/unset",
        )).json();

        $("#resync-nick").attr("disabled", !e.target.checked);

        return SA.fire({
            position: "bottom-start",
            title: res.error === 0 ? res.message : "Fehler beim aktualisieren des Nicknames",
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    };

    /**
     * Inject roles into appropriate container
     *
     * @param {array} roles
     * @param {string} selector
     * @param {number} [counter=0]
     * @returns {number}
     */
    const injectRoles = function(roles, selector, counter = 0){
        let round = counter;
        roles.forEach(r => {
            $(selector).append(`
<div class="flex role py-2 md:py-0">
    <div class="relative flex discord-input">
        <input type="checkbox" class="role-setter duration-300 hover:text-gray-300 cursor-pointer" name="role-${round}" id="role-${round}"${(r.on_user ? " checked" : "")}>
        <label for="role-${round}"></label>
        <span class="discord-tick"></span>
    </div>
    <label for="role-${round}" class="ml-4 block inline cursor-pointer">${r.role}</label>
</div>`,
            );
            round += 1;
        });
        return round;
    };

    /**
     * Retrieve Roles from Server
     *
     * @returns {Promise<number>}
     */
    const getRoles = async function(){
        const res = await (await fetch("/roles/get")).json();

        if (res.error !== 0){
            return SA.fire({
                position: "bottom-start",
                title: "Fehler beim laden der Rollen",
                toast: true,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }

        $(".user-info-dc-rollen").empty().addClass("grid-style");

        const count = injectRoles(res.roles.special, ".user-info-dc-rollen-special");
        return injectRoles(res.roles.stammtisch, ".user-info-dc-rollen-stammtisch", count);
    };

    /**
     * Set/Remove Role
     *
     * @param {Event & { target: HTMLInputElement }} e
     * @returns {Promise<void>}
     */
    const handleRoleChange = async function(e){
        const res = await (await fetch(((e.target.checked)
            ? "/roles/set?role="
            : "/roles/unset?role="
        ) + encodeURIComponent($(`label[for="${e.target.id}"]`).text()))).json();

        if (res.error) $(e.target).prop("checked", !$(e.target).prop("checked"));

        return (res.error
            ? SA.fire("Fehler beim aktualisieren der Rollen", res.message)
            : SA.fire({
                position: "bottom-start",
                title: res.message,
                toast: true,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            })
        );
    };

    /**
     * Hide rank sync notification
     *
     * @param {Event & { target: HTMLInputElement }} e
     */
    const hideNotification = function(e){
        e.preventDefault();
        $(".rank-was-synced").fadeOut();
    };

    /**
     * Show Bugs & Feedback modal
     *
     * @param {Event} e
     * @returns {void}
     */
    const bugsAndFeedback = function(e){
        e.preventDefault();
        return SA.fire(
            "Feedback & Bugs",
            "Für Feedback oder Infos über Bugs, bitte an TheShad0w wenden:<br><br>" +
            'pr0gramm: <a href="https://pr0gramm.com/user/TheShad0w" target="_blank" rel="noopener" style="color: #000">TheShad0w</a><br>' +
            "Discord: ShadowByte#1337<br><br>" +
            'Oder für Bug-Reports und Feature-Requests <a href="https://github.com/pr0-dev/disc0rd-dashboard/issues/new/choose" target="_blank" rel="noopener" style="color: #000">einen Issue auf GitHub erstellen</a><br><br>' +
            'Source Code: <a href="https://github.com/pr0-dev/disc0rd-dashboard" target="_blank" rel="noopener" style="color: #000">GitHub</a><br><br>' +
            'Hilfe beim Frontend-Design: <a href="https://pr0gramm.com/user/jonas32" target="_blank" rel="noopener" style="color: #000">jonas32</a>',
        );
    };

    /**
     * Show nick info modal
     *
     * @param {Event} e
     * @returns {void}
     */
    const nickInfo = function(e){
        e.preventDefault();
        return SA.fire(
            "Informationen zum Nick-Sync:",
            "Ist diese Checkbox gesetzt, wird dein pr0gramm Username als Nickname im disc0rd gesetzt.<br><br>" +
            "Zusätzlich bekommst du die Rolle \"verified-nick\", sodass andere wissen, dass dein Discord Name auch wirklich zu deinem pr0gramm Account gehört.<br><br>" +
            "Wird diese Checkbox wieder deaktiviert, wird dein Nickname zurückgesetzt und die \"verified-nick\" Rolle wird entfernt.",
        );
    };

    // eslint-disable-next-line consistent-return
    $("a").attr("target", function(){
        if (this.host && this.host !== location.host) return "_blank";
    });

    // eslint-disable-next-line consistent-return
    $("a").attr("rel", function(){
        if (this.host && this.host !== location.host) return "noopener";
    });

    $(document).ready(function(){
        if ($(".logged-in-inner").hasClass("logged-in")){
            $("#sync-nick").on("change", e => handleNickChange(e));
            $("#resync-nick").on("click", e => handleNickChange(e, true));
            $("#rank-sync-hide").on("click", e => hideNotification(e));
            $(document).on("change", ".role-setter", e => handleRoleChange(e));
            $("#nick-info").on("click", e => nickInfo(e));
            getRoles();
        }
        $("#f-b").on("click", e => bugsAndFeedback(e));
    });
// @ts-ignore
})($ || window.jQuery, swal || window.swal || window.Swal);
