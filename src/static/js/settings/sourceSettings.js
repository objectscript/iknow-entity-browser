import { setInputValue } from "./values.js";

function bind (elements) {
    for (let e of elements) {
        setInputValue(document.getElementById(e)).addEventListener(`change`, setInputValue);
    }
}

export function init () {

    bind([
        "settings.host",
        "settings.port",
        "settings.domain",
        "settings.queryType",
        "settings.seed",
        "settings.webAppName"
    ]);

}