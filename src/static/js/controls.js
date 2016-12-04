/**
 * This file describes on-screen controls like UI link/remove buttons, etc.
 */
import { onSelectionUpdate, updateSelection } from "./selection";
import { dropDescendants } from "./model";

let dropChildrenButton = null,
    removeButton = null,
    selection = [];

onSelectionUpdate((sel) => {
    selection = sel;
    updateButtons();
});

function updateButtons () {
    let display = selection.length ? "block" : "none";
    dropChildrenButton.style.display = display;
    removeButton.classList.add("disabled"); // temporary
}

function deleteSelection () {

}

function dropChildren () {
    if (!selection.length)
        return;
    dropDescendants(selection);
    updateSelection();
}

export function init () {
    dropChildrenButton = document.getElementById(`dropChildrenButton`);
    dropChildrenButton.addEventListener("click", () => dropChildren());
    removeButton = document.getElementById(`removeButton`);
    removeButton.addEventListener("click", () => deleteSelection());
    updateButtons();
}