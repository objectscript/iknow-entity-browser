import { csv } from "./export";
import * as model from "../model";

var graph;

export function updateSelectedNodes () {
    if (!model.uiState.tableToggled)
        return;
    let data = graph.nodes.filter(node => !!node.selected).sort((a, b) =>
            a.entities[0].score > b.entities[0].score ? -1 : 1
        ),
        table = document.querySelector("#table table tbody");
    table.textContent = "";
    for (let i = 0; i < data.length; i++) {
        let row = table.insertRow(i),
            node = data[i];
        row.insertCell(0).textContent = node.id;
        row.insertCell(1).textContent = node.label;
        row.insertCell(2).textContent = node.entities[0].score;
        row.insertCell(3).textContent = node.entities[0].frequency;
        row.insertCell(4).textContent = node.entities[0].spread;
    }
}

export function init () {

    graph = model.getGraphData();

    d3.select("#tableToggle")
        .data([model.uiState])
        .on("click", function (d) {
            d.tableToggled = !d.tableToggled;
            d3.select(this).classed("toggled", d.tableToggled);
            d3.select("#table").classed("active", d.tableToggled);
            updateSelectedNodes();
        });

    d3.select("#exportCSV").on("click", () => {
        csv([].slice.call(document.querySelector("#table table").rows).map(row =>
            [].slice.call(row.cells).map(cell => cell.textContent)
        ));
    });

}