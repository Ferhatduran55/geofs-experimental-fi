class Plugin {
    constructor() {
        this.instances = []
    }

    use(plugin, local = false) {
        if (local) {
            this[plugin.constructor.name] = plugin
        } else {
            this.instances[plugin.constructor.name] = plugin
        }
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