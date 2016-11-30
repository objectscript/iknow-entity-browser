import sampleData from "../sample_output2.json";
import { getData, getOption } from "../source";
import { toggleLoader } from "../utils";

let SIZE_CRITERIA = "frequency",
    FOLDING_CRITERIA = "frequency";

function preprocess (graph) {
    let zeroID = null;
    graph.nodes.forEach(node => { if (!zeroID && node.id === 0) zeroID = node; });
    if (!zeroID) {
        graph.nodes.push({
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
    return graph;
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
