import sampleData from "../sample_output2.json";
import { getData, getOption } from "../source";
import { toggleLoader } from "../utils";

let SIZE_CRITERIA = "frequency",
    FOLDING_CRITERIA = "frequency",
    MAX_CHILDREN = 20,
    MIN_RADIUS = 5;

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
        _children: rest,
        children: [],
        radius: 10,
        entities: [],
        id: Math.random()
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

    return {
        graph: graph,
        tree: tree,
        foldedTree: foldedTree
    };

}

let graph = preprocess(sampleData.graph);

/**
 * Updates the data from a server.
 * @param callback
 */
export function update (callback) {
    toggleLoader();
    getData(data => {
        toggleLoader(false);
        if (data.error || !data.graph) {
            alert(data.error || `No graph data returned`);
        } else {
            graph = preprocess(data.graph);
        }
        callback();
    });
}

export function getGraphData () {
    return graph;
}

export let uiState = {
    tabularToggled: false,
    detailsToggled: false,
    settingsToggled: false
};
