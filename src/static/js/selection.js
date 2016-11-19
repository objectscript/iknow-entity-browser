import * as model from "./model";

let selection = [],
    callbacks = [];

export function updateSelection () {

    selection = model.getGraphData().nodes.filter(node => !!node.selected);

    callbacks.forEach(c => c(selection));

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
 */