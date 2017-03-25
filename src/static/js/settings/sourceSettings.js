import { setInputValue, getOption, getChanges, applyChanges } from "./values.js";
import * as model from "../model"
import * as graph from "../graph";

function bind (elements) {
    for (let e of elements) {
        let el = document.getElementById(e);
        setInputValue(el);
        if (el.getAttribute("type") === "text")
            el.addEventListener(`input`, setInputValue);
        else
            el.addEventListener(`change`, setInputValue);
    }
}

export function init () {

    bind([
        "settings.host",
        "settings.port",
        "settings.domain",
        "settings.queryType",
        "settings.seed",
        "settings.webAppName",
        "settings.keepSeedInView",
        "settings.tabularShowHiddenNodes"
    ]);

    function apply () {
        if (getChanges().length !== 0) {
            applyChanges();
            model.update(() => graph.update(true));
        }
    }

    document.getElementById("settings.queryType").addEventListener(`change`, () => {
        if (!getOption("keepSeedInView") || model.uiState.settingsToggled)
            return;
        apply();
    });

    document.getElementById("settings.seed").addEventListener(`blur`, () => {
        if (!getOption("keepSeedInView") || model.uiState.settingsToggled)
            return;
        apply();
    });
    document.getElementById("settings.seed").addEventListener(`keydown`, (e) => {
        if (e.keyCode !== 13)
            return;
        document.getElementById("settings.seed").blur();
    });
}