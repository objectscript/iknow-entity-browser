import * as model from "./model";

let selection = [],
    callbacks = [],
    lastSelectedNode = null;

export function updateSelection () {

    let tree = model.getGraphData();
    selection = [];

    function findSelected (node) {
        if (node.selected)
            selection.push(node);
        if (node.children)
            for (let n of node.children) findSelected(n);
    }
    findSelected(tree);

    if (!selection.length) lastSelectedNode = null;
    if (lastSelectedNode && !lastSelectedNode.selected) {
        lastSelectedNode = selection[selection.length - 1];
    }

    callbacks.forEach(
        c => c(selection, lastSelectedNode || selection[selection.length - 1] || null)
    );

}

export function setLastSelectedNode (node) {

    if (node && typeof node.id !== "undefined")
        lastSelectedNode = node;
    else
        lastSelectedNode = null;

}

/**
 * The callback is invoked when selection changes.
 * @param {selectionCallback} callback
 */
export function onSelectionUpdate (callback) {

    callbacks.push(callback);

}

/**
 * This callback is invoked when selection changes.
 * @callback selectionCallback
 * @param {*[]} nodes - Currently selected nodes.
 * @param {*} lastNodeSelected - The last node selected by user.
 */