// ==UserScript==
// @name         FlightAssistant
// @namespace    Ferhatduran55
// @version      0.2
// @description  take control of it all!
// @author       Ferhatduran55
// @match        https://www.geo-fs.com/geofs.php?v=3.66
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// ==/UserScript==
/* global $:false, jQuery:false, toastr:false, geofs:false */

class Plugin {
    constructor() {
        this.instances = []
    }

    use(plugin) {
        this.instances[plugin.constructor.name] = plugin
    }

    appendFilesToHead(arr = [], forceExt = false) {
        for (let i = 0; i < arr.length; i++) {
            let urlStr = arr[i]
            let ext = forceExt ? forceExt : urlStr.slice(Math.max(0, urlStr.lastIndexOf(".")) + 1)
            let el = null

            switch (ext) {
                case "js":
                    el = $( "<script/>", {type: "text/javascript", src: urlStr})
                    break;
                case "css":
                    el = $("<link>", {rel: "stylesheet", type: "text/css", href: urlStr})
                    break;
                default:
                    el = $( "<script/>", {type: "text/javascript", src: urlStr})
            }
            $("head").eq(0).append(el)
        }
    }

    disableElements(arr) {
        arr.forEach((e) => $(e).css("display", "none"))
    }
}

class Toastr {
    constructor(options = null) {
        this.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        this._load(options ?? this.options)
    }

    notify(type, content) {
        toastr[type](content)
    }

    _load(options) {
        toastr.options = options
    }
}

class FlightAssistant {
    constructor(plugin = null) {
        this.plugins = plugin?.instances ?? {}
        this.init()
    }

    init() {
        this.generateFlightAssistantContainer()
        this.generateFlightAssistantButton()

        this._Toastr = this.plugins.Toastr
        this.showNotification("success", "FlightAssistant Loaded")
    }

    showNotification(type, content) {
        this._Toastr.notify(type, content)
    }

    flightAssistant() {
        this.showNotification("info", "This plugin is under development")
    }

    generateFlightAssistantContainer() {
        let c = $("<div/>", {
            class: "geofs-list geofs-toggle-panel geofs-assistant-list",
        }).data({
            noblur: true,
            onshow: "{geofs.initializePreferencesPanel()}",
            onhide: "{geofs.savePreferencesPanel()}",
        }).html('');
        this.renderFlightAssistantContainer(c);
    }

    renderFlightAssistantContainer(gen) {
        $(document).find(".geofs-ui-left").eq(0).append(gen);
    }

    generateFlightAssistantButton() {
        let b = $("<button/>", {
            class: "mdl-button mdl-js-button geofs-f-standard-ui",
            id: "assistantbutton",
            tabindex: 0,
            text: "ASSISTANT",
            onclick: "flightassistant.init.flightAssistant()"
        }).data({
            upgraded: ",MaterialButton",
        }).attr({
            "data-toggle-panel": ".geofs-assistant-list",
            "data-tooltip-classname": "mdl-tooltip--top",
        }).prop({
            title: "Flight Assistant",
        })
        this.renderFlightAssistantButton(b);
    }

    renderFlightAssistantButton(gen) {
        if (geofs.version >= 3.6) {
            $(document).find(".geofs-ui-bottom").eq(0).contents().eq(4).before(gen);
        } else {
            $(document).find(".geofs-ui-bottom").eq(0).contents().eq(3).before(gen);
        }
    }
}

(() => {
    'use strict';

    let storage = {
        version: geofs.version,
        // compress: false,
        options: {
            prefix: ''
        },

        // Greasemonkey storage API
        read: function (key, defaultValue) {
            const raw = GM_getValue(this._prefix(key), defaultValue);
            // let str = (this.compress) ? LZString.decompressFromUTF16(raw) : raw;
            return this._parse(raw);
        },
        write: function (key, value) {
            const raw = this._stringify(value);
            // let str = (this.compress) ? LZString.compressToUTF16(raw) : raw;
            return GM_setValue(this._prefix(key), raw);
        },
        delete: function (key) {
            return GM_deleteValue(this._prefix(key));
        },
        readKeys: function () {
            return GM_listValues();
        },

        // “Set” means “add if absent, replace if present.”
        set: function (key, value) {
            let savedVal = this.read(key);

            if (typeof savedVal === 'undefined' || !savedVal) {
                // add if absent
                return this.add(key, value);
            } else {
                // replace if present
                this.write(key, value);
                return true;
            }
        },
        // “Add” means “add if absent, do nothing if present” (if a uniquing collection).
        add: function (key, value) {
            let savedVal = this.read(key, false);

            if (typeof savedVal === 'undefined' || !savedVal) {
                this.write(key, value);
                return true;
            } else {
                if (this._isArray(savedVal)) { // is array
                    let index = savedVal.indexOf(value);

                    if (index !== -1) {
                        // do nothing if present
                        return false;
                    } else {
                        // add if absent
                        savedVal.push(value);
                        this.write(key, savedVal);
                        return true;
                    }
                } else if (this._isObject(savedVal)) { // is object
                    // merge obj value on obj
                    let result, objToMerge = value;

                    result = Object.assign(savedVal, objToMerge);
                    this.write(key, result);
                    return false;
                }
                return false;
            }
        },
        // “Replace” means “replace if present, do nothing if absent.”
        replace: function (key, itemFind, itemReplacement) {
            let savedVal = this.read(key, false);

            if (typeof savedVal === 'undefined' || !savedVal) {
                // do nothing if absent
                return false;
            } else {
                if (this._isArray(savedVal)) { // is Array
                    let index = savedVal.indexOf(itemFind);

                    if (index !== -1) {
                        // replace if present
                        savedVal[index] = itemReplacement;
                        this.write(key, savedVal);
                        return true;
                    } else {
                        // do nothing if absent
                        return false;
                    }
                } else if (this._isObject(savedVal)) {
                    // is Object
                    // replace property's value
                    savedVal[itemFind] = itemReplacement;
                    this.write(key, savedVal);
                    return true;
                }
                return false;
            }
        },
        // “Remove” means “remove if present, do nothing if absent.”
        remove: function (key, value) {
            if (typeof value === 'undefined') { // remove key
                this.delete(key);
                return true;
            } else { // value present
                let savedVal = this.read(key);

                if (typeof savedVal === 'undefined' || !savedVal) {
                    return true;
                } else {
                    if (this._isArray(savedVal)) { // is Array
                        let index = savedVal.indexOf(value);

                        if (index !== -1) {
                            // remove if present
                            savedVal.splice(index, 1);
                            this.write(key, savedVal);
                            return true;
                        } else {
                            // do nothing if absent
                            return false;
                        }
                    } else if (this._isObject(savedVal)) { // is Object
                        let property = value;

                        delete savedVal[property];
                        this.write(key, savedVal);
                        return true;
                    }
                    return false;
                }
            }
        },
        get: function (key, defaultValue) {
            return this.read(key, defaultValue);
        },
        getAll: function () {
            const keys = this._listKeys();
            let obj = {};

            for (let i = 0, len = keys.length; i < len; i++) {
                obj[keys[i]] = this.read(keys[i]);
            }
            return obj;
        },
        getKeys: function () {
            return this._listKeys();
        },
        getPrefix: function () {
            return this.options.prefix;
        },
        empty: function () {
            const keys = this._listKeys();

            for (let i = 0, len = keys.lenght; i < len; i++) {
                this.delete(keys[i]);
            }
        },
        has: function (key) {
            return this.get(key) !== null;
        },
        forEach: function (callbackFunc) {
            const allContent = this.getAll();

            for (let prop in allContent) {
                callbackFunc(prop, allContent[prop]);
            }
        },
        _parse: function (value) {
            if (this._isJson(value)) {
                return JSON.parse(value);
            }
            return value;
        },
        _stringify: function (value) {
            if (this._isJson(value)) {
                return value;
            }
            return JSON.stringify(value);
        },
        _listKeys: function (usePrefix = false) {
            const prefixed = this.readKeys();
            let unprefixed = [];

            if (usePrefix) {
                return prefixed;
            } else {
                for (let i = 0, len = prefixed.length; i < len; i++) {
                    unprefixed[i] = this._unprefix(prefixed[i]);
                }
                return unprefixed;
            }
        },
        _prefix: function (key) {
            return this.options.prefix + key;
        },
        _unprefix: function (key) {
            return key.substring(this.options.prefix.length);
        },
        _isJson: function (item) {
            try {
                JSON.parse(item);
            } catch (e) {
                return false;
            }
            return true;
        },
        _isObject: function (a) {
            return (!!a) && (a.constructor === Object);
        },
        _isArray: function (a) {
            return (!!a) && (a.constructor === Array);
        }
    };

    const files = [
        "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css"
    ]

    const disableElements = [
        '.geofs-adbanner.geofs-adsense-container',
        '.geofs-creditContainer.geofs-notForMobile',
    ]

    const plugin = new Plugin()
    plugin.use(new Toastr())

    plugin.appendFilesToHead(files)
    plugin.instances.Toastr.notify("info", "External Files Imported")

    plugin.disableElements(disableElements)
    plugin.instances.Toastr.notify("info", "Some Elements Disabled")

    const initialize = new FlightAssistant(plugin)
    unsafeWindow.flightassistant = {
        init: initialize,
        storage: storage,
        plugin: plugin
    }
})();
