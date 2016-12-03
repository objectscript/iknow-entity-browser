import { getGraphData } from "../model";
import { updateSelection, setLastSelectedNode } from "../selection";

let shiftKey, ctrlKey,
    width = window.innerWidth,
    height = window.innerHeight;

let svg = null,
    brush = null,
    node,
    link,
    links,
    nodes,
    zoomer = d3.zoom()
        .scaleExtent([1/4, 100])
        .on("zoom", () => {
            view.attr("transform", d3.event.transform);
        }),
    dragger = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    simulation = d3.forceSimulation()
        .force("link",
            d3.forceLink()
                .distance(d => 50 + (d.source.radius + d.target.radius) * 2)
                .id(d => d.id)
        )
        .force("charge",
            d3.forceManyBody()
                .strength(d => { return -10 * d.radius; })
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked),
    brusher = d3.brush()
        .extent([[-9999999, -9999999], [9999999, 9999999]])
        .on("start.brush", () => {
            if (!d3.event.sourceEvent) return;
            node.each((d) => {
                d.previouslySelected = ctrlKey && d.selected;
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
                if (selected) setLastSelectedNode(d);
                return d.selected = d.previouslySelected ^ selected;
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

function ticked () {
    if (!link)
        return;
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
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
        .datum(() => { return { selected: false, previouslySelected: false }; })
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

function resetChildrenPosition (parent, children = []) {
    if (!children || !children.length)
        return;
    for (let c of children) {
        c.x = parent.x;
        c.y = parent.y;
        if (c.children)
            resetChildrenPosition(c, c.children);
    }
}

export function update (reset = false) {

    let g = getGraphData().foldedTree,
        fl = flatten(g),
        graph = {
            nodes: fl,
            edges: flattenEdges(g)
        };

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
        );
    link = linkEnter.merge(link);

    node = nodes.selectAll(".node").data(graph.nodes, (d) => d.id);
    node.exit().remove();
    let nodeEnter = node.enter().append("g")
        .attr("class", d => `node${ d.id === 0 ? " root" : "" } ${ d.type || "unknown" }`)
        .call(dragger)
        .on("dblclick", function (d) {
            d3.event.stopPropagation();
            if (d.type === "folder" && d._children && d._children.length) {
                let next = d._children.splice(0, 20),
                    left = parseInt(d.label) - 20;
                resetChildrenPosition(d, next);
                d.children = d.children.concat(next);
                d.label = left > 0 ? `${ left } more` : `Others`;
                d3.select(this).select("text").text(d.label);
                update();
            }
        })
        .on("click", function (d) {
            if (d3.event.defaultPrevented) return;
            if (!ctrlKey) {
                node.classed("selected", (p) => p.selected = p.previouslySelected = false)
            }
            d3.select(this).classed("selected", d.selected = !d.selected); // (!prevSel)
            setLastSelectedNode(d.selected ? d : null);
            updateSelection();
        });

    nodeEnter.append("circle")
        .attr("r", d => d.radius);

    nodeEnter.append("text")
        .attr("dy", ".3em")
        .attr("style", d => `font-size:${ Math.round(d.radius / 2) }px`)
        .text(d => d.label);
    node = nodeEnter.merge(node);

    simulation
        .nodes(graph.nodes)
        .force("link")
        .links(graph.edges);

    simulation.restart();

    brush.call(brusher)
        .on(".brush", null);

    brush.select('.overlay').style('cursor', 'auto');

    if (reset) {
        for (let i = 100; i > 0; --i) simulation.tick();
    }

}