import * as storage from "../storage";
import { getObjProp } from "../utils";

const STORAGE_KEY = "settings";

let settings = { // assign defaults here
    host: "http://localhost",
    port: "57772",
    webAppName: "EntityBrowser",
    domain: "1",
    queryType: "related",
    seed: "crew",
    keepSeedInView: false,
    tabularColumns: [
        {
            label: "ID",
            property: ["id"]
        },
        {
            label: "Type",
            property: ["edgeType"],
            class: true
        },
        {
            label: "Label",
            property: ["label"]
        },
        {
            label: "Score",
            property: ["entities", 0, "score"]
        },
        {
            label: "Spread",
            property: ["entities", 0, "spread"]
        },
        {
            label: "Frequency",
            property: ["entities", 0, "frequency"]
        },
        {
            label: "Parent",
            property: ["parent", "label"],
            default: "root"
        }
    ]
};
let changes = [];

let initialStorage = storage.load(STORAGE_KEY);
for (let option in initialStorage) {
    settings[option] = initialStorage[option];
}

/**
 * This function "applies" settings so that getChanges() will return empty array until
 */
export function applyChanges () {
    changes = [];
}

/**
 * @returns {string[]} of changed keys.
 */
export function getChanges () {
    return changes;
}

export function getOption (opt) {
    return settings[opt];
}

export function setOption (options, value) {
    let opts = settings,
        opt = options;
    if (options instanceof Array) {
        opts = getObjProp(settings, options.slice(0, -1));
        opt = options[options.length - 1];
    }
    opts[opt] = value;
    changes.push([options, value]);
    saveSettings();
}

function applyFixedClass () {
    document.getElementById("querySetting")
        .classList.toggle("fixed", !!settings["keepSeedInView"]);
}

function saveSettings () {
    applyFixedClass();
    storage.save(STORAGE_KEY, settings);
}

export function setInputValue (e = {}) {
    let isEvent = !(e instanceof HTMLElement),
        id, el = isEvent ? (e.target || e.srcElement) : e;
    if (!el)
        return e;
    if ((id = el.getAttribute(`id`)).indexOf(`settings.`) === 0) {
        let key = id.replace(/^settings\./, ``),
            prop = el.getAttribute("type") === "checkbox" ? "checked" : "value";
        if (isEvent) {
            settings[key] = el[prop];
            changes.push([key, el[prop]]);
            saveSettings();
        } else {
            el[prop] = settings[key];
        }
    }
    return e;
}

export function init () {
    applyFixedClass();
}