import { csv } from "./export";
import * as model from "../model";
import { onSelectionUpdate, updateSelection, getSelection } from "../selection";

let sorting = {
    enabled: false,
    properties: ["entities", "0", "score"],
    order: 1
};

let sorter = (a, b) => {
    let i = 0;
    while (i < sorting.properties.length && typeof (a = a[sorting.properties[i]]) !== "undefined"
    && typeof (b = b[sorting.properties[i]]) !== "undefined") { console.log(i); ++i }
    return a > b ? -sorting.order : a === b ? 0 : sorting.order;
};

function updateSelected () {
    let data = getSelection().filter(node => node.type === "entity").sort(sorter),
        table = document.querySelector("#tabular-selected");
    table.textContent = "";
    for (let i = 0; i < data.length; i++) {
        let row = table.insertRow(i),
            node = data[i],
            c;
        row.insertCell(0).textContent = node.id;
        row.insertCell(1).textContent = node.label;
        row.insertCell(2).textContent = node.entities[0].score;
        row.insertCell(3).textContent = node.entities[0].frequency;
        row.insertCell(4).textContent = node.entities[0].spread;
        (c = row.insertCell(5)).textContent = node.edgeType || "";
        c.className = `${ node.edgeType }Item`;
        row.insertCell(6).textContent = (node.parent || { label: "root" }).label || "?";
    }
}

function updateOthers () {

}

onSelectionUpdate(() => {
    if (!model.uiState.tabularToggled)
        return;
    updateSelected();
});

export function init () {

    d3.select("#tableToggle")
        .data([model.uiState])
        .on("click", function (d) {
            d.tabularToggled = !d.tabularToggled;
            d3.select(this).classed("toggled", d.tabularToggled);
            d3.select("#table").classed("active", d.tabularToggled);
            updateSelection();
        });

    d3.select("#exportCSV").on("click", () => {
        csv([].slice.call(document.querySelector("#table table").rows).map(row =>
            [].slice.call(row.cells).map(cell => cell.textContent)
        ));
    });

}