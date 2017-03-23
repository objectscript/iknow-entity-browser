import * as model from "../model";
import * as graph from "../graph";
import * as sourceSettings from "./sourceSettings";
import * as tabularViewSettings from "./tabularViewSettings";
import { getChanges, applyChanges } from "./values";
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

    // make inputs auto-sizable
    [].slice.call(document.querySelectorAll(`input[autosize]`)).forEach((i) => makeAutosizable(i));

    sourceSettings.init();
    tabularViewSettings.init();

}