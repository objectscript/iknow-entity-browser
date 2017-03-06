import * as model from "../model";
import * as graph from "../graph";
import { getChanges, applyChanges } from "../source";

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
    [].slice.call(document.querySelectorAll(`input[autosize]`)).forEach((input) => {

        function updateInput () {
            let style = window.getComputedStyle(input),
                ghost = document.createElement(`span`);
            ghost.style.cssText = `box-sizing:content-box;display:inline-block;height:0;`
                + `overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:nowrap;`
                + `font-family:${ style.fontFamily };font-size:${ style.fontSize };`
                + `padding:${ style.padding }`;
            ghost.textContent = input.value;
            document.body.appendChild(ghost);
            input.style.width = ghost.offsetWidth + 4
                + (input.getAttribute("type") === "number" ? 20 : 0) + "px";
            document.body.removeChild(ghost);
        }

        input.style.minWidth = "30px";
        input.style.maxWidth = "90%";
        input.addEventListener(`input`, () => updateInput());
        updateInput();

        return input;

    });

}