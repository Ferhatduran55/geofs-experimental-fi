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