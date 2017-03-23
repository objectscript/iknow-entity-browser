import { getOption, setOption } from "./values";
import { makeAutosizable } from "../utils";

let element = null;

const properties = [
    ["id"],
    ["edgeType"],
    ["label"],
    ["entities", 0, "score"],
    ["entities", 0, "spread"],
    ["entities", 0, "frequency"],
    ["parent", "label"],
    ["parent", "id"]
];

export function init () {
    element = document.getElementById("settings.tabularColumns");
    updateColumnSettings();
}

function moveColumn (opts, index, inc = 1) {
    if (index + inc < 0 || index + inc >= opts.length)
        return;
    let opt = opts.splice(index, 1)[0];
    opts.splice(index + inc, 0, opt);
    setOption("tabularColumns", opts);
    updateColumnSettings();
}

function updateColumnSettings () {
    let cols = getOption("tabularColumns");
    while (element.firstChild)
        element.removeChild(element.firstChild);
    cols.forEach((column, index) => {
        let el = document.createElement("span"),
            inp = document.createElement("input"),
            propSelect = document.createElement("select"),
            close = document.createElement("i"),
            left = document.createElement("i"),
            right = document.createElement("i"),
            text = document.createTextNode(":");
        left.className = "icon-arrow-left";
        left.addEventListener("click", () => moveColumn(cols.slice(), index, -1));
        right.className = "icon-arrow-right";
        right.addEventListener("click", () => moveColumn(cols.slice(), index, 1));
        close.className = "icon-close";
        close.addEventListener("click", () => {
            let opts = cols.slice();
            opts.splice(index, 1);
            setOption("tabularColumns", opts);
            updateColumnSettings();
        });
        inp.setAttribute("type", "text");
        inp.value = column.label || "";
        makeAutosizable(inp);
        inp.addEventListener("change", () => {
            setOption(["tabularColumns", index, "label"], inp.value);
        });
        propSelect.setAttribute("title", "Node Property");
        for (let p of properties) {
            let opt = document.createElement("option"),
                val = p.join(".");
            opt.setAttribute("value", opt.textContent = val);
            if (column.property.join(".") === val)
                opt.selected = true;
            propSelect.appendChild(opt);
        }
        propSelect.addEventListener("change", () => {
            setOption(
                ["tabularColumns", index, "property"],
                propSelect.options[propSelect.selectedIndex].value.split(".")
            );
        });
        el.className = "column";
        el.appendChild(left);
        el.appendChild(inp);
        el.appendChild(text);
        el.appendChild(propSelect);
        el.appendChild(close);
        el.appendChild(right);
        element.appendChild(el);
    });
    let add = document.createElement("span"),
        icon = document.createElement("i");
    add.className = "column";
    add.style.paddingLeft = "4px";
    add.style.paddingRight = "5px";
    icon.className = "icon-add";
    add.addEventListener("click", () => {
        setOption("tabularColumns", cols.concat({
            label: "ID",
            property: ["id"]
        }));
        updateColumnSettings();
    });
    add.appendChild(icon);
    element.appendChild(add);
}