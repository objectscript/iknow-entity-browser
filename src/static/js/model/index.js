import sampleData from "../sample_output2.json";
import { getData, getOption } from "../source";
import { toggleLoader } from "../utils";
import * as history from "./history";

let SIZE_CRITERIA = "frequency",
    FOLDING_CRITERIA = "frequency",
    MAX_CHILDREN = 20,
    MIN_RADIUS = 5,
    graph = null,
    additionalNodeId = -1,
    updateCallbacks = [];

function fold (tree) {
    if (!tree.children || tree.children.length <= MAX_CHILDREN)
        return tree;
    for (let cld of tree.children) {
        fold(cld);
    }
    let rest = tree.children.splice(MAX_CHILDREN);
    tree.children.push({
        label: `${ rest.length } more`,
        type: "folder",
        edgeType: rest[0].edgeType,
        _children: rest,
        children: [],
        radius: 10,
        entities: [],
        id: additionalNodeId--
    });
    return tree;
}

/**
 * Converts flat input data into a tree using implicit parent-children relationships. This
 * function also sorts the children data by relevance.
 * @param graph
 * @param parent
 * @returns {*}
 */
function toTree (graph, parent) {

    parent.children = [];

    for (let edge of graph.edges) {
        if (edge.source !== parent.id)
            continue;
        let t = null;
        for (let node of graph.nodes) {
            if (node.id === edge.target) {
                t = node;
                break;
            }
        }
        if (t) {
            t.edgeType = edge.type;
            parent.children.push(toTree(graph, t));
        }
    }

    try {
        parent.children.sort(
            (a, b) => a.entities[0][FOLDING_CRITERIA] > b.entities[0][FOLDING_CRITERIA] ? -1 : 1
        );
    } catch (e) {
        console.error(`Error! Most likely, one of the graph nodes does not has any entities.`
            + ` The folding criteria displayed on the diagram would be random.`);
    }

    return parent;

}

/**
 * This function converts graph model data to internal application's format.
 * @param graph
 * @returns {{graph: *, tree: *, foldedTree: *}}
 */
function preprocess (graph) {

    let zeroID = null;

    graph.nodes.forEach(node => { if (!zeroID && node.id === 0) zeroID = node; });
    if (!zeroID) {
        graph.nodes.unshift(zeroID = {
            id: 0,
            label: getOption("seed"),
            type: "entity",
            entities: [{
                id: -1,
                value: getOption("seed"),
                [SIZE_CRITERIA]: 10000
            }]
        });
    }
    graph.nodes.forEach(node =>
        node.radius = MIN_RADIUS + Math.sqrt(node.entities[0][SIZE_CRITERIA] / 4 || 25));
    console.log(`Graph:`, graph);
    let tree = toTree(graph, zeroID),
        foldedTree = fold(tree);
    console.log(`Tree:`, tree);

    return foldedTree;

}

/**
 * Updates the data from a server.
 */
export function update () {
    toggleLoader();
    getData(data => {
        toggleLoader(false);
        if (data.error || !data.graph) {
            alert(data.error || `No graph data returned`);
        } else {
            graph = preprocess(data.graph);
            updateCallbacks.forEach(cb => cb(graph, true));
        }
    });
}

export function getGraphData () {
    return graph;
}

/**
 * This callback is invoked when graph is updated.
 * @callback modelUpdate
 * @param {*} graph
 * @param {boolean} force - Determines whether graph changed completely.
 */

/**
 * Model update handler.
 * @param {modelUpdate} callback
 */
export function onModelUpdate (callback) {
    if (typeof callback !== "function")
        throw new Error("Expecting function as a callback.");
    updateCallbacks.push(callback);
    if (graph)
        callback(graph, true);
}

export let uiState = {
    tabularToggled: false,
    detailsToggled: false,
    settingsToggled: false
};

export function init () {
    graph = preprocess(sampleData.graph);
    updateCallbacks.forEach(cb => cb(graph, true));
}

function resetChildrenPosition (parent, children = []) {
    if (!children || !children.length)
        return;
    for (let c of children) {
        c.x = parent.x;
        c.y = parent.y;
        if (c.children)
            resetChildrenPosition(c, c.children);
    }
}

// /**
//  * Replaces the tree object, because D3.js does not sensitive to the property changes.
//  * @param id - ID of the node in the graph
//  * @param assign - New properties to assign.
//  */
// export function assignNodeId (id, assign = {}) {
//
//     function rec (parent = null, tree = graph, i) {
//         if (tree.id === id) {
//             if (parent === null) {
//                 graph = Object.assign(Object.assign({}, tree), assign);
//                 return true;
//             } else {
//                 parent.children[i] = Object.assign(Object.assign({}, tree), assign);
//                 return true;
//             }
//         }
//         for (let c = 0; c < tree.children.length; c++) {
//             if (rec(tree, tree.children[c], c) === true)
//                 return true;
//         }
//         return false;
//     }
//
//     let res = rec();
//     console.log(res);
//     if (res)
//         updateCallbacks.forEach(cb => cb(graph));
//
// }
//
// function getNodeById (id) {
//
//     let target = null;
//
//     function recurse (node) {
//         if (node.id === id) {
//             target = node;
//             return true;
//         }
//         if (node.children) {
//             for (let n of node.children) {
//                 if (recurse(n))
//                     return true;
//             }
//         }
//         return false;
//     }
//
//     recurse(graph);
//
//     return target;
//
// }

/**
 * Unfold the node
 * @param node - Node to unfold
 * @param [children] - Number of nodes to unfold
 * @returns {number} - Number of nodes left to unfold
 */
export function unfold (node, children = 20) {
    if (node.type !== "folder" || !node._children || !node._children.length)
        return 0;
    let newId = additionalNodeId--,
        oldId = node.id,
        f = () => {
            let next = node._children.splice(0, children),
                left = node._children.length;
            node.id = newId;
            node.children = node.children.concat(next);
            node.label = left > 0 ? `${ left } more` : `Others`;
            resetChildrenPosition(node, next);
            updateCallbacks.forEach(cb => cb(graph));
            return {
                unfolded: next.length,
                left: left
            };
        },
        res = f();
    history.createState({
        redo: f,
        undo: () => {
            let part = node.children.splice(-res.unfolded);
            node._children = part.concat(node._children);
            node.id = oldId;
            node.label = node._children.length > 0 ? `${ node._children.length } more` : `Others`;
            updateCallbacks.forEach(cb => cb(graph));
        }
    });
    return res.left;
}