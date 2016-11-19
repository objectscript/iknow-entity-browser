import sampleData from "../sample_output2.json";

function preprocess (graph) {
    graph.nodes.forEach(node => node.radius = 5 + Math.sqrt(node.entities[0].frequency / 4 || 25));
    return graph;
}

var graph = preprocess(sampleData.graph);

export function getGraphData () {
    return graph;
}

export var uiState = {
    tabularToggled: false,
    detailsToggled: false,
    settingsToggled: false
};
