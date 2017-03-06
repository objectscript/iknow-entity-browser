const STORAGE_NAME = "iKnowEntityBrowser";
const storage = JSON.parse(localStorage.getItem(STORAGE_NAME)) || {};

export function save (key, value) {
    storage[key] = value;
    updateLocalStorage();
}

export function load (key) {
    return storage[key];
}

function updateLocalStorage () {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
}