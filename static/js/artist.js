/***********************************************************
* 
* The Truth Behind Aural Pleasure
* CS109 Final Project
* Jennifer Chen, Joy Ming, and Ryan Lee
*
* artist.js
* code that sets up artist d3 graph
* 
************************************************************/

// defining the basic specs for the graph

var width = 600,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-500)
    .gravity(1)
    .linkDistance(function(d) {
      return d.target._children ? 100 : 30;
    })
    .size([width, height]);

var svg = d3.select("#artist-d3").append("svg")
    .attr("width", width)
    .attr("height", height);

// read in the data for the artist graph with info
d3.xml("../static/resources/artist_graph_withinfo.gexf", "application/xml", function(gexf) {

  // get the nodes from the xml file
  var xml_nodes = gexf.documentElement.getElementsByTagName('node');
  var node_names = new Array();
  var nodes = new Array();
  
  // extract information from each xml node
  for (n = 0; n< xml_nodes.length; n++) {
    node = xml_nodes[n];
    attrs = node.getElementsByTagName('attvalue')
    nodes.push({
      name: node.id,
      genre: attrs[0].getAttribute('value'),
      pagerank: attrs[1].getAttribute('value'),
      modularity: attrs[2].getAttribute('value'),
      score: attrs[3].getAttribute('value')
    });
    node_names.push(node.id);
  }

  // get links from xml file
  var links = new Array();
  var xml_links = gexf.documentElement.getElementsByTagName('edge');

  // extract information from each xml link
  for (l=0; l < xml_links.length-1; l++) {
    link = xml_links[l];
    var source_name = link.getAttribute('source');
    var target_name = link.getAttribute('target');
    links.push({
      source: node_names.indexOf(source_name),
      target: node_names.indexOf(target_name),
      value: link.getAttribute('weight')
    })
  }

  // create all of the links
  var link = svg.selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')

    .style("stroke-width", function(d) {
      return 0.1*Math.sqrt(d.value); 
    });

  // create all of the nodes
  var node = svg.selectAll(".node")
    .data(nodes)
  .enter().append("g")
    .attr("class", "node")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .call(force.drag);

  node.append("circle")
    .attr("r", MIN_NODE);

  node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { 
      var str = d.name
      return str; 
    })
    .style({opacity: '0.0'});

  colorNodes('artist', node);
  sizeNodes('artist', node);

  // create the force graph

  force
    .nodes(nodes)
    .links(links)
    .start();

  // initialize node placement  
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

   node
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

  // handlers to change node colors
  $('#artist-color').on('change', function() {
    colorNodes('artist', node);
  })

  // handlers to change node size
  $('#artist-size').on('change', function() {
    sizeNodes('artist', node);
  })

  // function to handle mouseover expansion of circle and display of text
  function mouseover() {
    d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 16);
    d3.select(this).select('text').transition()
      .duration(750)
      .style({opacity: 1.0});
  }

  // function to handle mouseout shrinking of circle and hiding of text
  function mouseout() {
    d3.select(this).select('text').transition()
      .duration(750)
      .style({opacity: 0.0});
    sizeNodes('artist', node);
  }

});
