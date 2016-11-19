import * as model from "../model";
import { onSelectionUpdate } from "../selection";

let selectedNode = null;

onSelectionUpdate((selection) => {

    d3.select("#nodeDetailsToggle").classed("disabled", selection.length !== 1);
    selectedNode = selection.length === 1 ? selection[0] : null;
    updateHeader();

});

function updateHeader () {

    d3.select("#nodeDetails .header .text").text(
        selectedNode
            ? `Node "${ selectedNode.label }" (${ selectedNode.type }) selected.`
            : "Please, select one node."
    );

    if (!selectedNode) {
        d3.select("#nodeDetails").classed("active", model.uiState.detailsToggled = false);
    }

}

export function init () {

    d3.select("#nodeDetailsToggle")
        .data([model.uiState])
        .on("click", function (d) {
            if (!selectedNode)
                return;
            d.detailsToggled = !d.detailsToggled;
            d3.select("#nodeDetails").classed("active", d.detailsToggled);
        });

    updateHeader();

}