import sampleData from "./sampleData.json";

var graph = preprocess(sampleData.graph);

function preprocess (graph) {
    graph.nodes.forEach(node => node.radius = 5 + Math.sqrt(node.entities[0].frequency || 25));
    return graph;
}

window.init = () => {

    var zoom = d3.zoom()
        .scaleExtent([1/4, 40])
        .on("zoom", () => {
            view.attr("transform", d3.event.transform);
        });

    var svg = d3
            .select("svg")
            .call(zoom),
        width = window.innerWidth,
        height = window.innerHeight;

    var view = svg
        .append("g")
        .attr("class", "view");

    // var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link",
            d3.forceLink()
                .distance(d => 50 + (d.source.radius + d.target.radius) * 2)
                .id(d => d.id)
        )
        .force("charge",
            d3.forceManyBody()
                .strength(d => { return -10 * d.radius; })
        )
        .force("center", d3.forceCenter(width / 2, height / 2));

    var link = view.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.edges)
        .enter().append("line")
        .attr("stroke", d => d.type === "similar" ? "#f70" : "#000");

    var node = view.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var circle = node.append("circle")
        .attr("r", d => d.radius);

    node.append("text")
        .attr("dy", ".3em")
        .attr("style", d => `font-size:${ Math.round(d.radius / 2) }px`)
        .text(d => d.label);

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.edges);

    for (var i = 100; i > 0; --i) simulation.tick();

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

};