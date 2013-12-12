/***********************************************************
* 
* The Truth Behind Aural Pleasure
* CS109 Final Project
* Jennifer Chen, Joy Ming, and Ryan Lee
*
* playlist.js
* code that sets up playlist d3 graph
* 
************************************************************/

// defining the basic specs for the graph

var width_playlist = 600,
    height_playlist = 500;

var color_playlist = d3.scale.category20();

var force_playlist = d3.layout.force()
    .charge( -300)
    .gravity(1)
    .linkDistance(function(d) {
      return d.target._children ? 100 : 30;
    })
    .size([width_playlist, height_playlist]);

var svg_playlist = d3.select("#playlist-d3").append("svg")
    .attr("width", width_playlist)
    .attr("height", height_playlist);

// read in the data for the user preferences graph
$.getJSON("../static/js/user_graph.json", function(data) {

  // get nodes and links
  console.log(data)
  var nodes = data.nodes
  var links = data.links

  // create links
  var link = svg_playlist.selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .style("stroke-width", function(d) { return 0.1*Math.sqrt(d.value); });

  // create nodes
  var node = svg_playlist.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr("class", "node")
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)
    .call(force_playlist.drag);

  node.append('circle')
    .attr('r', MIN_NODE);

  node.append("title")
    .text(function(d) { return d.name; });

  node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { 
      var str = d.id
      return str; 
    })
    .style({opacity: '0.0'});

  node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  colorNodes('playlist', node);

  // force the graph
  force_playlist
    .nodes(nodes)
    .links(links)
    .start();

  // initialize the positions
  force_playlist.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
  });

  // change color of nodes
  $('#playlist-color').on('change', function() {
    colorNodes('playlist', node);
  })

  // change size of nodes
  $('#playlist-size').on('change', function() {
    sizeNodes('playlist', node);
  })

  // handles moving mouse to node
  function mouseover() {
    d3.select(this).select("circle").transition()
      .duration(200)
      .attr("r", 16);
    d3.select(this).select('text').transition()
      .duration(200)
      .style({opacity: 1.0});
  }

  // handles moving mouse from node
  function mouseout() {
    d3.select(this).select('text').transition()
      .duration(200)
      .style({opacity: 0.0});
    sizeNodes('playlist', node);
  }

});
