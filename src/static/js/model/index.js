import sampleData from "../sample_output2.json";
import { getData, getOption } from "../source";
import { toggleLoader } from "../utils";

let SIZE_CRITERIA = "frequency",
    FOLDING_CRITERIA = "frequency",
    MAX_CHILDREN = 20;

function fold (tree) {
    if (!tree.children || tree.children.length <= MAX_CHILDREN)
        return tree;
    for (let cld of tree.children) {
        fold(cld);
    }
    let rest = tree.children.splice(MAX_CHILDREN);
    tree.children.push({
        label: "...",
        type: "folder",
        _children: rest,
        radius: 10,
        entities: [],
        id: Math.random()
    });
    return tree;
}

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
    parent.children.sort((a, b) => a[FOLDING_CRITERIA] > b[FOLDING_CRITERIA] ? 1 : -1);
    return parent;
}

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
                value: getOption("seed")
            }]
        });
    }
    graph.nodes.forEach(node =>
        node.radius = 5 + Math.sqrt(node.entities[0][SIZE_CRITERIA] / 4 || 25));
    console.log(graph);
    // fold(graph, zeroID);
    let tree = toTree(graph, zeroID),
        foldedTree = fold(tree);
    console.log(tree);

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
