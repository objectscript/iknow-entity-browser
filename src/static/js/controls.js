/**
 * This file describes on-screen controls like UI link/remove buttons, etc.
 */
import { onSelectionUpdate, updateSelection } from "./selection";
import { dropDescendants, dropNodes } from "./model";
import { updateSelected, scaleBy, resetZoom } from "./graph"

let dropChildrenButton = null,
    removeButton = null,
    resetSelectionButton = null,
    zoomInButton = null,
    resetViewButton = null,
    zoomOutButton = null,
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
    resetSelectionButton.classList[selection.length > 0 ? "remove" : "add"]("icon-outline");
    resetSelectionButton.classList[selection.length == 0 ? "remove" : "add"]("icon-filled");
    resetSelectionButton.classList[selection.length > 0 ? "remove" : "add"]("disabled");
}

function resetSelection () {
    selection.forEach(n => n.selected = n.wasSelected = false);
    updateSelection();
    updateSelected();
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
    dropChildrenButton.addEventListener("click", dropChildren);
    removeButton = document.getElementById(`removeButton`);
    removeButton.addEventListener("click", deleteSelection);
    resetSelectionButton = document.getElementById(`resetSelectionButton`);
    resetSelectionButton.addEventListener(`click`, resetSelection);
    zoomInButton = document.getElementById(`zoomInButton`);
    zoomInButton.addEventListener("click", () => scaleBy(1.5));
    resetViewButton = document.getElementById(`resetZoomButton`);
    resetViewButton.addEventListener("click", () => resetZoom());
    zoomOutButton = document.getElementById(`zoomOutButton`);
    zoomOutButton.addEventListener("click", () => scaleBy(0.75));
    updateButtons();
}