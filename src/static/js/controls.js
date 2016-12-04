/**
 * This file describes on-screen controls like UI link/remove buttons, etc.
 */
import { onSelectionUpdate } from "./selection";

let dropChildrenButton = null,
    removeButton = null,
    selection = [];

onSelectionUpdate((sel) => {
    selection = sel;
    updateButtons();
});

function updateButtons () {
    let display = selection.length ? "block" : "none";
    dropChildrenButton.style.display = removeButton.style.display = display;
}

function deleteSelection () {

}

export function init () {
    dropChildrenButton = document.getElementById(`dropChildrenButton`);
    (removeButton = document.getElementById(`removeButton`)).addEventListener("click",
        () => deleteSelection()
    );
    updateButtons();
}