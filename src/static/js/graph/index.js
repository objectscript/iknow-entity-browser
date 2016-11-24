import { updateSelectedNodes } from "../tabular";
import { getGraphData } from "../model";
import { updateSelection, setLastSelectedNode } from "../selection";

let shiftKey, ctrlKey,
    width = window.innerWidth,
    height = window.innerHeight,
    foreverUniq = 0;

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
        .force("center", d3.forceCenter(width / 2, height / 2)),
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

export function update () {

    let graph = getGraphData();

    link = link
        .data(graph.edges, (d) => foreverUniq++);
    link.exit().remove();
    link = link.enter().append("line")
        .attr("class", d => d.type === "similar"
            ? "similar"
            : d.type === "related"
            ? "related"
            : "other"
        );

    node = node
        .data(graph.nodes, (d) => foreverUniq++);
    node.exit().remove();
    node = node.enter().append("g")
        .attr("class", "node")
        .call(dragger)
        .on("dblclick", () => d3.event.stopPropagation())
        .on("click", function (d) {
            if (d3.event.defaultPrevented) return;
            if (!ctrlKey) {
                node.classed("selected", (p) => p.selected = p.previouslySelected = false)
            }
            d3.select(this).classed("selected", d.selected = !d.selected); // (!prevSel)
            setLastSelectedNode(d.selected ? d : null);
            updateSelection();
        });

    node.append("circle")
        .attr("r", d => d.radius);

    node.append("text")
        .attr("dy", ".3em")
        .attr("style", d => `font-size:${ Math.round(d.radius / 2) }px`)
        .text(d => d.label);

    node.exit().remove();
    link.exit().remove();

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.edges);

    simulation.restart();

    brush.call(brusher)
        .on(".brush", null);

    brush.select('.overlay').style('cursor', 'auto');

    for (let i = 100; i > 0; --i) simulation.tick();

}