import sampleData from "./sample_output2.json";

var graph = preprocess(sampleData.graph);

function preprocess (graph) {
    graph.nodes.forEach(node => node.radius = 5 + Math.sqrt(node.entities[0].frequency || 25));
    return graph;
}

function updateSelectedNodes () {
    let data = graph.nodes.filter(node => !!node.selected),
        table = document.querySelector("#table table tbody");
    table.textContent = "";
    for (let i = 0; i < data.length; i++) {
        let row = table.insertRow(i),
            node = data[i];
        row.insertCell(0).textContent = node.id;
        row.insertCell(1).textContent = node.label;
        row.insertCell(2).textContent = node.entities[0].frequency;
    }
}

window.init = () => {

    var shiftKey, ctrlKey,
        width = window.innerWidth,
        height = window.innerHeight;

    var zoomer = d3.zoom()
        .scaleExtent([1/4, 40])
        .on("zoom", () => {
            view.attr("transform", d3.event.transform);
        });

    var dragger = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    d3.select(window)
        .on("keydown", keyDown)
        .on("keyup", keyUp);

    var svg = d3.select("#graph")
        .call(zoomer);

    var view = svg
        .append("g")
        .attr("class", "view");

    var brush = view.append("g")
        .datum(() => { return { selected: false, previouslySelected: false }; })
        .attr("class", "brush");

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
        .attr("class", d => d.type === "similar"
            ? "similar"
            : d.type === "related"
                ? "related"
                : "other"
        );

    var node = view.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(dragger)
        .on("dblclick", () => d3.event.stopPropagation())
        .on("click", function (d) {
            if (d3.event.defaultPrevented) return;
            if (!ctrlKey) {
                node.classed("selected", (p) => p.selected = p.previouslySelected = false)
            }
            d3.select(this).classed("selected", d.selected = !d.previouslySelected);
            updateSelectedNodes();
        });

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

    var brusher = d3.brush()
        .extent([[-9999999, -9999999], [9999999, 9999999]])
        .on("start.brush", () => {
            if (!d3.event.sourceEvent) return;
            node.each((d) => {
                d.previouslySelected = ctrlKey && d.selected;
            });
        })
        .on("brush.brush", () => {
            if (!d3.event.sourceEvent) return;
            var extent = d3.event.selection;
            if (!extent)
                return;
            node.classed("selected", (d) => {
                return d.selected = d.previouslySelected ^
                    (extent[0][0] <= d.x && d.x < extent[1][0]
                    && extent[0][1] <= d.y && d.y < extent[1][1]);
            });
        })
        .on("end.brush", () => {
            if (!d3.event.sourceEvent) return;
            setTimeout(() => {
                brush.call(brusher.move, null);
                updateSelectedNodes();
            }, 25);
        });

    brush.call(brusher)
        .on(".brush", null);

    brush.select('.overlay').style('cursor', 'auto');

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

    d3.select("#tableToggle")
        .data([{ toggled: false }])
        .on("click", (d) => {
            d.toggled = !d.toggled;
            d3.select("#table").classed("active", d.toggled);
        });

};