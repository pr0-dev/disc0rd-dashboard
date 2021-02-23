"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable no-var, no-use-before-define, consistent-return */

let handleNickChange = async function(){
    let res = await (await fetch(
        this.checked
            ? "/nick/set"
            : "/nick/unset"
    )).json();

    console.log(res);
};

($ => {
    $("a").attr("target", function(){
        if (this.host && this.host !== location.host) return "_blank";
    });

    $("a").attr("rel", function(){
        if (this.host && this.host !== location.host) return "noopener";
    });

    $(document).ready(function(){
        $("#sync-nick").on("change", handleNickChange);
    });
// @ts-ignore
})($ || window.jQuery);
