/**
 * This file describes on-screen controls like UI link/remove buttons, etc.
 */
import { onSelectionUpdate, updateSelection } from "./selection";
import { dropDescendants, dropNodes } from "./model";

let dropChildrenButton = null,
    removeButton = null,
    selection = [];

onSelectionUpdate((sel) => {
    selection = sel;
    updateButtons();
});

function updateButtons () {
    let toDrop = 0;
    for (let node of selection) {
        toDrop += (node.children ? node.children.length : 0);
    }
    removeButton.classList[selection.length > 0 ? "remove" : "add"]("disabled");
    dropChildrenButton.classList[toDrop > 0 ? "remove" : "add"]("disabled");
}

function deleteSelection () {
    if (!selection.length)
        return;
    dropNodes(selection);
    updateSelection();
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