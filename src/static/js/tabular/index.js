import { csv } from "./export";
import * as model from "../model";
import {
    onSelectionUpdate, updateSelection, getSelection, getOthers, getHidden, selectAll, deselectAll
} from "../selection";
import { getOption } from "../settings/values";
import { getObjProp } from "../utils";
import { translateBy, focusOn } from "../graph";

let sorting = {
    properties: ["entities", "0", "frequency"],
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
    let columns = getOption("tabularColumns");
    for (let i = 0; i < data.length; i++) {
        let row = table.insertRow(i),
            node = data[i];
        for (let col = 0; col < columns.length; col++) {
            let cell = row.insertCell(col),
                cVal = getObjProp(node, columns[col].property),
                val = typeof cVal === "undefined"
                    ? (columns[col].default || "")
                    : cVal;
            cell.textContent = val;
            if (columns[col].class)
                cell.className = val;
        }
        let ee = document.createElement("i"),
            ei = document.createElement("i"),
            sel = false,
            cell = row.insertCell(columns.length);
        for (let o of node.children) { if (o.selected) { sel = true; break; } }
        ei.className = `icon-${ sel ? "filled" : "outline" }`;
        ei.setAttribute("title", `${ sel ? "Deselect" : "Select" } children`);
        ei.addEventListener("click", toggleChildrenSelected.bind(node));
        ee.className = `icon-${ selected ? "close" : "add" }`;
        ee.setAttribute("title", `${ selected ? "Remove from" : "Add to" } selection`);
        ee.addEventListener("click", switchSelected.bind(node));
        cell.appendChild(ee);
        if (node.children.length) cell.appendChild(ei);
        row.addEventListener("mouseover", () =>
            node.element && node.element.classList.add("highlighted"));
        row.addEventListener("mouseout", () =>
            node.element && node.element.classList.remove("highlighted"));
        row.addEventListener("click", () => node.element && focusOn(node.x, node.y));
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

function updateHidden () {
    let data = getHidden().filter(node => node.type === "entity").sort(sorter),
        table = document.querySelector("#tabular-hidden");
    table.textContent = "";
    if (getOption("tabularShowHiddenNodes"))
        insertRows(data, table, false);
}

function updateAll () {
    updateHeaders();
    updateSelected();
    updateOthers();
    updateHidden();
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
        sorting.order = sorting.order === -1 ? 1 : sorting.order === 1 ? 0 : -1;
    else
        sorting.order = -1;
    sorting.properties = arr;
    updateHeaders(attr);
    updateAll();
}

function updateHeaders (dataProp = sorting.properties.join(".")) {
    let head = document.querySelector("#tabular thead tr");
    while (head.firstChild) head.removeChild(head.firstChild);
    getOption("tabularColumns").forEach((h) => {
        let el = document.createElement("th");
        el.textContent = h.label;
        el.setAttribute("data-prop", h.property.join("."));
        el.addEventListener("click", columnClicked);
        if (h.property.join(".") === dataProp) el.classList.toggle(
            `sort-${ sorting.order === 1 ? "up" : "down" }`,
            sorting.order !== 0
        );
        head.appendChild(el);
    });
    head.appendChild(document.createElement("th"));
}

function updateToolbarsWidth () {
    document.getElementById("querySetting").style.width =
        document.getElementById("toolbarIcons").style.width =
            (document.body.getBoundingClientRect().width - (model.uiState.tabularToggled
                ? document.getElementById("table").getBoundingClientRect().width : 0))
            + "px";
}

export function init () {

    window.addEventListener("resize", updateToolbarsWidth);
    updateToolbarsWidth();

    d3.select("#tableToggle")
        .data([model.uiState])
        .on("click", function (d) {
            d.tabularToggled = !d.tabularToggled;
            d3.select(this).classed("toggled", d.tabularToggled);
            d3.select("#table").classed("active", d.tabularToggled);
            if (d.tabularToggled)
                updateAll();
            updateToolbarsWidth();
            let w = document.getElementById("table").getBoundingClientRect().width / 2;
            translateBy(d.tabularToggled ? -w : w);
        });

    d3.select("#exportCSV").on("click", () => {
        csv([].slice.call(document.querySelector("#table table").rows).map(row =>
            [].slice.call(row.cells).map(cell => cell.textContent)
        ));
    });

    updateHeaders();

}