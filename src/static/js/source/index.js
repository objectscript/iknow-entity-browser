import { httpGet } from "../utils";

let settings = {

};

export function getOption (opt) {
    return settings[opt];
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

export function getData (callback) {
    let https = (settings["host"] || "").indexOf("https://") === 0;
    httpGet(`${ settings["host"] }${ 
        settings["port"] === (https ? 443 : 80) ? "" : ":" + settings["port"] 
    }/${ settings["webAppName"] }/domain/${ encodeURIComponent(settings["domain"]) }/${
        encodeURIComponent(settings["queryType"])
    }/${
        encodeURIComponent(settings["seed"]) 
    }`, callback);
}

function bind (elements) {
    elements.forEach(e => {
        setValue(document.getElementById(e)).addEventListener(`change`, setValue)
    });
}

function setValue (e = {}) {
    let id, el = e instanceof HTMLElement ? e : (e.target || e.srcElement);
    if (!el)
        return e;
    if ((id = el.getAttribute(`id`)).indexOf(`settings.`) === 0) {
        settings[id.replace(/^settings\./, ``)] = el.value;
    }
    return e;
}