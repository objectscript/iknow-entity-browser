import * as model from "./model";

let selection = [],
    others = [],
    callbacks = [];

export function updateSelection () {

    let tree = model.getGraphData();
    selection = [];
    others = [];

    function findSelected (node) {
        if (node.selected)
            selection.push(node);
        else
            others.push(node);
        if (node.children)
            for (let n of node.children) findSelected(n);
    }
    findSelected(tree);

    callbacks.forEach(c => c(selection));

}

export function getSelection () {
    return selection;
}

export function getOthers () {
    return others;
}

export function selectAll (node) {
    if (!node)
        return;
    if (node.children)
        node.children.forEach(c => selectAll(c));
    node.selected = true;
}

export function deselectAll (node) {
    if (!node)
        return;
    if (node.children)
        node.children.forEach(c => deselectAll(c));
    node.selected = false;
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