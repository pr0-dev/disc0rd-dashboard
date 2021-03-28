"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable no-var, no-use-before-define, consistent-return, quotes */

/**
 * Set/Remove Nickname
 *
 * @param {Event & { target: HTMLInputElement }} e
 * @param {any} SA
 * @param {boolean} [force=false]
 * @returns {Promise<void>}
 */
let handleNickChange = async function(e, SA, $, force = false){
    let res = await (await fetch(
        (force || e.target.checked)
            ? "/nick/set"
            : "/nick/unset"
    )).json();

    $("#resync-nick").attr("disabled", !e.target.checked);

    return SA.fire({
        position: "bottom-start",
        title: res.error === 0 ? res.message : "Fehler beim aktualisieren des Nicknames",
        // background: "#9AA3B5",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
};

/**
 * Retrieve Roles from Server
 *
 * @param {any} SA
 * @param {any} $
 * @returns {Promise<void>}
 */
let getRoles = async function(SA, $){
    let res = await (await fetch("/roles/get")).json();

    if (res.error !== 0){
        return SA.fire({
            position: "bottom-start",
            title: "Fehler beim laden der Rollen",
            // background: "#9AA3B5",
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    }

    $(".user-info-dc-rollen").empty().addClass("grid-style");

    return res.roles.forEach((r, i) => {
        $(".user-info-dc-rollen").append(
            '<div class="role">' +
            '    <input type="checkbox" class="role-setter" name="role-' + i + '" id="role-' + i + '"' + (r.on_user ? " checked" : "") + '>' +
            '    <label for="role-' + i + '">' + r.role + '</label>' +
            '</div>'
        );
    });
};

/**
 * Set/Remove Role
 *
 * @param {Event & { target: HTMLInputElement }} e
 * @param {any} SA
 * @param {any} $
 * @returns {Promise<void>}
 */
let handleRoleChange = async function(e, SA, $){
    let res = await (await fetch(((e.target.checked)
        ? "/roles/set?role="
        : "/roles/unset?role="
    ) + encodeURIComponent($('label[for="' + e.target.id + '"]').text()))).json();

    return SA.fire({
        position: "bottom-start",
        title: res.error === 0 ? res.message : "Fehler beim aktualisieren der Rollen",
        // background: "#9AA3B5",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
};

/**
 * Show Bugs & Feedback modal
 *
 * @param {Event} e
 * @param {any} SA
 * @returns {void}
 */
let bugsAndFeedback = function(e, SA){
    e.preventDefault();
    return SA.fire(
        "Feedback & Bugs",
        "Für Feedback oder Infos über Bugs, bitte an TheShad0w wenden:<br><br>" +
        'pr0gramm: <a href="https://pr0gramm.com/user/TheShad0w" target="_blank" rel="noopener" style="color: #000">TheShad0w</a><br>' +
        "Discord: ShadowByte#1337"
    );
};

(($, SA) => {
    $("a").attr("target", function(){
        if (this.host && this.host !== location.host) return "_blank";
    });

    $("a").attr("rel", function(){
        if (this.host && this.host !== location.host) return "noopener";
    });

    $(document).ready(function(){
        if ($(".logged-in-inner").hasClass("logged-in")){
            $("#sync-nick").on("change", e => handleNickChange(e, SA, $));
            $("#resync-nick").on("click", e => handleNickChange(e, SA, $, true));
            $(document).on("change", ".role-setter", e => handleRoleChange(e, SA, $));
            getRoles(SA, $);
        }
        $("#f-b").on("click", e => bugsAndFeedback(e, SA));
    });
// @ts-ignore
})($ || window.jQuery, swal || window.swal || window.Swal);
