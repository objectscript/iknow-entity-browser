import { httpGet } from "../utils";
import * as storage from "../storage";

const STORAGE_KEY = "settings";

let settings = { // assign defaults here
    host: "http://localhost",
    port: "57772",
    webAppName: "EntityBrowser",
    domain: "1",
    queryType: "related",
    seed: "crew"
};

let initialStorage = storage.load(STORAGE_KEY);
for (let option in initialStorage) {
    settings[option] = initialStorage[option];
}

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
    for (let e of elements) {
        setValue(document.getElementById(e)).addEventListener(`change`, setValue);
    }
}

function saveSettings () {
    storage.save(STORAGE_KEY, settings);
}

function setValue (e = {}) {
    let isEvent = !(e instanceof HTMLElement),
        id, el = isEvent ? (e.target || e.srcElement) : e;
    if (!el)
        return e;
    if ((id = el.getAttribute(`id`)).indexOf(`settings.`) === 0) {
        let key = id.replace(/^settings\./, ``);
        if (isEvent) {
            settings[key] = el.value;
            saveSettings();
        } else {
            el.value = settings[key];
        }
    }
    return e;
}