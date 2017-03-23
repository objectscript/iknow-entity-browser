import { onModelUpdate, unfold, dropNodesm, uiState } from "../model";
import { updateSelection, selectAll, deselectAll } from "../selection";

let shiftKey, ctrlKey,
    width = window.innerWidth,
    height = window.innerHeight,
    lastGraph = null;

let svg = null,
    brush = null,
    node,
    link,
    links,
    nodes,
    zoomer = d3.zoom()
        .scaleExtent([1/6, 100])
        .on("zoom", () => {
            view.attr("transform", d3.event.transform);
        }),
    dragger = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    simulation = newSimulation(),
    brusher = d3.brush()
        .extent([[-9999999, -9999999], [9999999, 9999999]])
        .on("start.brush", () => {
            if (!d3.event.sourceEvent) return;
            node.each((d) => {
                d.wasSelected = ctrlKey && d.selected;
            });
        })
        .on("brush.brush", () => {
            if (!d3.event.sourceEvent) return;
            let extent = d3.event.selection;
            if (!extent)
                return;
            node.classed("selected", (d) => {
                let selected = (extent[0][0] <= d.x && d.x < extent[1][0]
                && extent[0][1] <= d.y && d.y < extent[1][1]);
                return d.selected = d.wasSelected ^ selected;
            });
        })
        .on("end.brush", () => {
            if (!d3.event.sourceEvent) return;
            setTimeout(() => {
                brush.call(brusher.move, null);
                updateSelection();
            }, 25);
        }),
    view = null;

export function translateBy (x = 0, y = 0) {
    svg.transition()
        .duration(300)
        .call(zoomer.translateBy, x, y);
}

export function scaleBy (delta = 1) {
    svg.transition()
        .duration(300)
        .call(zoomer.scaleBy, delta);
}

export function resetZoom () {
    svg.transition()
        .duration(300)
        .call(zoomer.transform, d3.zoomIdentity.translate(
            uiState.tabularToggled
                ? - document.getElementById("table").getBoundingClientRect().width / 2
                : 0,
            0)
        );
}

export function updateSelected () {
    node.classed("selected", p => p.selected);
}

function newSimulation () {
    return d3.forceSimulation()
        .force("link",
            d3.forceLink()
                .distance(d => 30 + (d.source.radius + d.target.radius) * 2)
                .id(d => d.id)
        )
        .force("charge",
            d3.forceManyBody()
                .strength(d => { return -7 * d.radius; })
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);
}

const ARROW_FWD = 2;

function ticked () {
    if (!link)
        return;
    link
        .attr("x1", d => {
            d.dir = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
            return d.source.x + Math.cos(d.dir) * d.source.radius;
        })
        .attr("y1", d => d.source.y + Math.sin(d.dir) * d.source.radius)
        .attr("x2", d => d.target.x - Math.cos(d.dir) * (d.target.radius + ARROW_FWD))
        .attr("y2", d => d.target.y - Math.sin(d.dir) *(d.target.radius + ARROW_FWD));
    node
        .attr("transform", (d) => `translate(${ d.x },${ d.y })`)
}

function dragstarted (d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged (d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended (d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function keyDown () {
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
    ctrlKey = d3.event.ctrlKey;

    if (d3.event.keyCode == 67) { // the 'c' key
        // do stuff
    }

    if (ctrlKey) {
        brush.select('.overlay').style('cursor', 'crosshair');
        brush.call(brusher);
        d3.event.preventDefault();
    }
}

function keyUp () {
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
    ctrlKey = d3.event.ctrlKey;

    brush.call(brusher)
        .on(".brush", null);

    brush.select('.overlay').style('cursor', 'auto');
}

export function init () {
    svg = d3.select("#graph")
        .call(zoomer);
    view = svg
        .append("g")
        .attr("class", "view");
    brush = view.append("g")
        .datum(() => { return { selected: false, wasSelected: false }; })
        .attr("class", "brush");
    links = view.append("g").attr("class", "links");
    nodes = view.append("g").attr("class", "nodes");
    link = links.selectAll("line");
    node = nodes.selectAll(".node");
    d3.select(window)
        .on("keydown", keyDown)
        .on("keyup", keyUp);
}

function flatten (root) {

    let nodes = [];

    function recurse (node) {
        if (node.children) node.children.forEach(recurse);
        // if (!node.id) node.id = ++i;
        nodes.push(node);
    }

    recurse(root);

    return nodes;

}

function flattenEdges (root) {

    let edges = [];

    function recurse (node) {
        if (!node.children)
            return;
        for (let c of node.children) {
            recurse(c);
            edges.push({ source: node, target: c, type: c.edgeType });
        }
    }

    recurse(root);

    return edges;

}

onModelUpdate((graph, force) => update(graph, force));

export function update (g = lastGraph, reset = false) {

    if (!reset) {
        // g = JSON.parse(JSON.stringify(g));
        // g.id = -100;
    }

    let fl = flatten(g);

    let graph = {
            nodes: fl,
            edges: flattenEdges(g)
        };

    lastGraph = g;

    if (reset) {
        link = link.data([]);
        link.exit().remove();
        node = node.data([]);
        node.exit().remove();
    }

    link = links.selectAll("line").data(graph.edges, (d) => d.target.id);
    link.exit().remove();
    let linkEnter = link.enter().append("line")
        .attr("class", d => d.type === "similar"
            ? "similar"
            : d.type === "related"
            ? "related"
            : "other"
        )
        .attr("marker-end", d => `url(#svgLineArrow-${ d.type })`);
    link = linkEnter.merge(link);

    node = nodes.selectAll(".node").data(graph.nodes, function (d) { return this._id || d.id; });
    node.exit().remove();
    let nodeEnter = node.enter().append("g")
        .each(function (d) { this._id = d.id; d.element = this; })
        .attr("class", d => `node${ d.id === 0 ? " root" : "" } ${ d.type || "unknown" }`)
        .classed("selected", (p) => p.selected)
        .call(dragger)
        .on("dblclick", function (d) {
            if (d.type !== "folder")
                return;
            d3.event.stopPropagation();
            let left;
            if (d.parent && (left = unfold(d, d.parent))) {
                d.fx = d.x; d.fy = d.y;
                setTimeout(() => d.fx = d.fy = null, 1000);
            }
            if (left === 0) {
                dropNodes(d);
            }
        })
        .on("click", function (d) {
            if (d3.event.defaultPrevented) return;
            if (shiftKey) {
                if (d.selected)
                    deselectAll(d);
                else
                    selectAll(d);
            } else {
                d3.select(this).classed("selected", d.selected = !d.selected); // (!prevSel)
            }
            updateSelection();
        });

    nodeEnter.append("circle")
        .attr("r", d => d.radius);

    nodeEnter.append("text")
        .attr("dy", ".3em")
        .attr("style", d => `font-size:${ Math.round(d.radius / 2) }px`)
        .text(d => d.label);
    node = nodeEnter.merge(node);

    if (reset)
        simulation = newSimulation();

    simulation
        .nodes(graph.nodes)
        .force("link")
        .links(graph.edges);

    simulation.alpha(reset ? 1 : 0.4).restart();

    brush.call(brusher)
        .on(".brush", null);

    brush.select('.overlay').style('cursor', 'auto');

    if (reset) {
        for (let i = 100; i > 0; --i) simulation.tick();
        updateSelection();
    }

}