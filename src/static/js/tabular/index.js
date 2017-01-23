import { csv } from "./export";
import * as model from "../model";
import {
    onSelectionUpdate, updateSelection, getSelection, getOthers, selectAll, deselectAll
} from "../selection";

let sorting = {
    properties: ["entities", "0", "score"],
    order: 1
};

let sorter = (a, b) => {
    let i = 0;
    while (i < sorting.properties.length && typeof (a = a[sorting.properties[i]]) !== "undefined"
    && typeof (b = b[sorting.properties[i]]) !== "undefined") { ++i }
    return a > b ? sorting.order : a === b ? 0 : -sorting.order;
};

/**
 * this: node
 */
function switchSelected () {
    if (!this.element)
        return;
    this.element.classList.remove("highlighted");
    d3.select(this.element).classed("selected", this.selected = !this.selected);
    updateSelection();
}

/**
 * this: node
 */
function toggleChildrenSelected (e) {
    let sel = false,
        el = e.target || e.srcElement;
    for (let o of this.children) { if (o.selected) { sel = true; break; } }
    if (sel)
        deselectAll(this, false);
    else
        selectAll(this, false);
    el.className = `icon-${ !sel ? "filled" : "outline" }`;
    this.element.classList.remove("highlighted");
    updateSelection();
}

function insertRows (data, table, selected) {
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
        let ee = document.createElement("i"),
            ei = document.createElement("i"),
            sel = false,
            cell = row.insertCell(7);
        for (let o of node.children) { if (o.selected) { sel = true; break; } }
        ei.className = `icon-${ sel ? "filled" : "outline" }`;
        ei.addEventListener("click", toggleChildrenSelected.bind(node));
        ee.className = `icon-${ selected ? "close" : "add" }`;
        ee.addEventListener("click", switchSelected.bind(node));
        cell.appendChild(ei);
        cell.appendChild(ee);
        row.addEventListener("mouseover", () => { node.element.classList.add("highlighted"); });
        row.addEventListener("mouseout", () => { node.element.classList.remove("highlighted"); });
    }
}

function updateSelected () {
    let data = getSelection().filter(node => node.type === "entity").sort(sorter),
        table = document.querySelector("#tabular-selected");
    table.textContent = "";
    insertRows(data, table, true);
}

function updateOthers () {
    let data = getOthers().filter(node => node.type === "entity").sort(sorter),
        table = document.querySelector("#tabular-others");
    table.textContent = "";
    insertRows(data, table, false);
}

function updateAll () {
    updateSelected();
    updateOthers();
}

onSelectionUpdate(() => {
    if (!model.uiState.tabularToggled)
        return;
    updateAll();
});

/**
 * @this {HTMLElement} TH
 */
function columnClicked () {
    let attr = this.getAttribute("data-prop"),
        arr = attr.split(".");
    if (attr === sorting.properties.join("."))
        sorting.order = sorting.order === 1 ? -1 : sorting.order === -1 ? 0 : 1;
    else
        sorting.order = 1;
    sorting.properties = arr;
    updateAll();
    updateHeaders(attr);
}

function updateHeaders (dataProp = undefined) {
    [].slice.call(document.querySelectorAll("#tabular thead th")).forEach((th) => {
        th.classList.remove("sort-up");
        th.classList.remove("sort-down");
        if (th.getAttribute("data-prop") !== dataProp)
            return;
        th.classList.toggle(`sort-${ sorting.order === 1 ? "up" : "down" }`, sorting.order !== 0);
    });
}

export function init () {

    d3.select("#tableToggle")
        .data([model.uiState])
        .on("click", function (d) {
            d.tabularToggled = !d.tabularToggled;
            d3.select(this).classed("toggled", d.tabularToggled);
            d3.select("#table").classed("active", d.tabularToggled);
            if (d.tabularToggled)
                updateAll();
        });

    d3.select("#exportCSV").on("click", () => {
        csv([].slice.call(document.querySelector("#table table").rows).map(row =>
            [].slice.call(row.cells).map(cell => cell.textContent)
        ));
    });

    [].slice.call(document.querySelectorAll("#tabular thead th")).forEach((th) => {
        if (!th.getAttribute("data-prop")) return;
        th.addEventListener("click", columnClicked);
    });

    updateHeaders(sorting.properties.join("."));

}