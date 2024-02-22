import $ from "jquery/dist/jquery.slim.min.js";

export class Assistant {
  static init() {
    this.generateFlightAssistantContainer();
    this.generateFlightAssistantButton();
  }

  static generateFlightAssistantContainer() {
    let c = $("<ul/>", {
      class: "geofs-list geofs-toggle-panel geofs-assistant-list",
    }).attr({
      "data-noblur": "true",
      "data-onshow": "{geofs.initializePreferencesPanel()}",
      "data-onhide": "{geofs.savePreferencesPanel()}",
    });
    this.renderFlightAssistantContainer(c);
  }

  static renderFlightAssistantContainer(gen) {
    $(document).find(".geofs-ui-left").eq(0).contents().eq(7).before(gen);
    gen.append(
      `<style>#flightAssistantSetMaxRPM:focus,#flightAssistantSetMinRPM:focus{outline: 0;border: 0;box-shadow: 0px 0px 8px 2px rgb(0 0 0 / 45%) !important;}</style>`
    );
    gen.append(
      $("<input>", {
        id: "flightAssistantSetMaxRPM",
        style:
          "width: 90%;margin: 1% 4%;border: 0;border-radius: 5px;padding: 2%;box-shadow: 0px 0px 8px 1px rgb(0 0 0 / 40%);",
        type: "number",
        onchange: `if ($(this).val() >= flightAssistant.instance.minRPM ) {flightAssistant.instance.maxRPM = $(this).val()}`,
        placeholder: "Set Max RPM: ..Between 0 and 1000000..",
        min: 0,
        max: 1000000,
        step: 100,
      })
    );
    gen.append(
      $("<input>", {
        id: "flightAssistantSetMinRPM",
        style:
          "width: 90%;margin: 1% 4%;border: 0;border-radius: 5px;padding: 2%;box-shadow: 0px 0px 8px 1px rgb(0 0 0 / 40%);",
        type: "number",
        onchange: `if ($(this).val() <= flightAssistant.instance.maxRPM ) {flightAssistant.instance.minRPM = $(this).val()}`,
        placeholder: "Set Min RPM: ..Between 0 and 1000000..",
        min: 0,
        max: 1000000,
        step: 100,
      })
    );
  }

  static generateFlightAssistantButton() {
    let b = $("<button/>", {
      class: "mdl-button mdl-js-button geofs-f-standard-ui",
      id: "assistantbutton",
      tabindex: 0,
      text: "ASSISTANT",
    })
      .data({
        upgraded: ",MaterialButton",
      })
      .attr({
        "data-toggle-panel": ".geofs-assistant-list",
        "data-tooltip-classname": "mdl-tooltip--top",
      })
      .prop({
        title: "Flight Assistant",
      });
    this.renderFlightAssistantButton(b);
  }

  static renderFlightAssistantButton(gen) {
    if (geofs.version >= 3.6) {
      $(document).find(".geofs-ui-bottom").eq(0).contents().eq(4).before(gen);
    } else {
      $(document).find(".geofs-ui-bottom").eq(0).contents().eq(3).before(gen);
    }
  }
}
