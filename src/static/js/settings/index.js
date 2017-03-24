import * as model from "../model";
import * as graph from "../graph";
import * as sourceSettings from "./sourceSettings";
import * as tabularViewSettings from "./tabularViewSettings";
import * as storage from "../storage";
import { getChanges, applyChanges, init as initValues } from "./values";
import { makeAutosizable } from "../utils";

function toggleSettings (uiStateModel) {
    uiStateModel.settingsToggled = !uiStateModel.settingsToggled;
    d3.select("#settings").classed("active", uiStateModel.settingsToggled);
    d3.select("#windows").classed("offScreen", uiStateModel.settingsToggled);
    if (!uiStateModel.settingsToggled && getChanges().length !== 0) {
        applyChanges();
        model.update(() => graph.update(true));
    }
}

export function init () {

    d3.select("#settingsToggle")
        .data([model.uiState])
        .on("click", toggleSettings);

    d3.select("#closeSettingsToggle")
        .data([model.uiState])
        .on("click", toggleSettings);

    tabularViewSettings.init();
    initValues();
    sourceSettings.init();

    // make inputs auto-sizable
    [].slice.call(document.querySelectorAll(`input[autosize]`)).forEach((i) => makeAutosizable(i));
    document.getElementById("settings.resetSettings").addEventListener("click", () => {
        if (!confirm("Do you want to set all the settings to defaults?"))
            return;
        storage.reset();
        location.reload();
    });

}