import * as model from "../model";
import { onSelectionUpdate } from "../selection";

let selectedNode = null;

onSelectionUpdate((selection, lastNodeSelected) => {

    d3.select("#nodeDetailsToggle").classed("disabled", selection.length === 0);
    selectedNode = lastNodeSelected
        ? lastNodeSelected
        : selection.length > 0
            ? selection[selection.length - 1]
            : null;
    updateHeader();

});

function updateHeader () {

    let typeName = ((selectedNode || {}).type || "Node".toString());

    d3.select("#nodeDetails .header .text").text(
        selectedNode
            ? `${ typeName[0].toUpperCase() + typeName.slice(1) } "${ 
                selectedNode.label }" selected.`
            : "Please, select one node."
    );

    if (!selectedNode) {
        d3.select("#nodeDetails").classed("active", model.uiState.detailsToggled = false);
    } else {
        updateData();
    }

}

function updateData () {

    if (!selectedNode)
        return;

    let tableElement = document.querySelector("#nodeDetails-entitiesTable tbody");
        // labelElement = document.querySelector("#nodeDetails-label"),
        // idElement = document.querySelector("#nodeDetails-id");

    // idElement.textContent = selectedNode.id;
    // labelElement.textContent = selectedNode.label;

    tableElement.textContent = "";
    for (let i = 0; i < (selectedNode.entities || []).length; i++) {
        let row = tableElement.insertRow(i),
            entity = selectedNode.entities[i];
        row.insertCell(0).textContent = entity.value;
        row.insertCell(1).textContent = entity.id;
        row.insertCell(2).textContent = entity.frequency;
        row.insertCell(3).textContent = entity.score;
        row.insertCell(4).textContent = entity.spread;
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