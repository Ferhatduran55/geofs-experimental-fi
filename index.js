// ==UserScript==
// @name         FlightAssistant
// @namespace    Ferhatduran55
// @version      0.1
// @description  take control of it all!
// @author       Ferhatduran55
// @match        https://www.geo-fs.com/geofs.php?v=3.66
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        none
// ==/UserScript==

(function($) {
	'use strict';
    const disabledElements = [
		'.geofs-adbanner.geofs-adsense-container',
		'.geofs-creditContainer.geofs-notForMobile'
	];

	async function init(){
        let flightAssistantContainer = $(`<div></div>`)
        flightAssistantContainer.attr({
            "data-noblur": true,
            "data-onshow": "{geofs.initializePreferencesPanel()}",
            "data-onhide": "{geofs.savePreferencesPanel()}"
        })
            .addClass("geofs-list geofs-toggle-panel geofs-assistant-list geofs-visible")
            .html('');

        $(document).find(".geofs-ui-left").eq(0).append(flightAssistantContainer);

        let flightAssistantButton = $(`<button class="mdl-button mdl-js-button geofs-f-standard-ui" data-toggle-panel=".geofs-assistant-list" data-tooltip-classname="mdl-tooltip--top" id="assistantbutton" tabindex="0" data-upgraded=",MaterialButton" onclick="flightAssistant()" title="Flight Assistant">ASSISTANT</button>`)
        $('body').append(flightAssistantButton)
        let element = $("#assistantbutton")

        if (geofs.version >= 3.6){
            $(document).find(".geofs-ui-bottom").eq(0).contents().eq(4).before(element)
        } else {
            $(document).find(".geofs-ui-bottom").eq(0).contents().eq(3).before(element)
        }

        $.each(disabledElements, (i, e) => $(e).css("display","none"));
    }
    init();
})(jQuery);
