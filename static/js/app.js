
var width = 500,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-200)
    .linkDistance(20)
    .size([width, height]);

var svg = d3.select("#artist-d3").append("svg")
    .attr("width", width)
    .attr("height", height);

// var colors = ['#3366FF', '#6633FF', '#C3F', '#F3C', '#3CF', '#003DF5', '#002EB8', '#F36', '#3FC', '#B88A00', '#F5B800', '#F63', '#3F6', '#6F3', '#CF3', '#FC3', '#FF3', '#3FC'];

var colors = ['#9CF', '#FC9', '#FC9', '#99F', '#C9F', '#F9F', '#9FF', '#5CADFF', '#1F8FFF', '#F9C', '#9FC', '#F8F1F', '#FFAD5C', '#F99', '#9F9', '#CF9', '#FF9', '#FC9', '#FC9']

d3.xml("../static/resources/artist_graph_withinfo.gexf", "application/xml", function(gexf) {
// d3.xml("../static/resources/playlists_artist_graph.gexf", "application/xml", function(gexf) {
  // d3.xml("../static/resources/artist_")

  // console.log('gexf');
  // console.log(gexf.documentElement.getElementsByTagName('node'));

  var xml_nodes = gexf.documentElement.getElementsByTagName('node');

  console.log(xml_nodes);
  var node_names = new Array();
  var nodes = new Array();

  for (n = 0; n< xml_nodes.length; n++) {
  // for (n in xml_nodes) {
    // console.log(n);
    // console.log('stop');
  // for (n =0; n < 10; n++) {
    // console.log(xml_nodes[node].id);
    node = xml_nodes[n];
    // console.log(node);
    // if (n != 210)
    attrs = node.getElementsByTagName('attvalue')
    // else
      // attrs = ['no-genre', 0, 0, 0]
    // console.log(attrs[0].getAttribute('value'))
    nodes.push({
      name: node.id,
      genre: attrs[0].getAttribute('value'),
      pagerank: attrs[1].getAttribute('value'),
      modularity: attrs[2].getAttribute('value'),
      score: attrs[3].getAttribute('value')
    });

    node_names.push(node.id);
  }

  console.log(nodes);

  var links = new Array();

  var xml_links = gexf.documentElement.getElementsByTagName('edge');

  console.log(xml_links);

  // for (l in xml_links) {
  for (l=0; l < xml_links.length-1; l++) {
    link = xml_links[l];
    // console.log(link);
    // console.log(link.id, link.getAttribute('source'), link.target, link.weight)
    var source_name = link.getAttribute('source');
    var target_name = link.getAttribute('target');
    // console.log(source_name, target_name)
    links.push({
      source: node_names.indexOf(source_name),
      target: node_names.indexOf(target_name),
      value: link.getAttribute('weight')
      // value: 1
    })
  }

  console.log('links', links);

  // console.log('-----');
  // for (node in nodes) {
  //   if (nodes[node] == undefined) {
  //     console.log('derp' + node);
  //   }
  // }

  // for (link in links) {
  //   if (links[link] == undefined) {
  //     console.log('herp' + link);
  //   }
  // }
  // console.log('-----');

  var link = svg.selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  // console.log('link', link);

  var MIN_PAGERANK = 0.000753958309765
  var MAX_PAGERANK = 0.0122727168834
  var MIN_NODE = 3.
  var MAX_NODE = 15.
  var m = (MIN_NODE - MAX_NODE)/ (MIN_PAGERANK - MAX_PAGERANK)
  var b = MIN_NODE - MIN_PAGERANK * m
  console.log(m,b)

  var node = svg.selectAll('.node')
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    // .attr("r", 5)
    .attr('r', function(d) {
      console.log(d.pagerank, d.pagerank*m + b)
      return d.pagerank*m + b
    })
    // .style("fill", function(d) { return color(d.group); })
    .style('fill', function(d) { 
      // console.log(d.modularity)
      return colors[d.modularity]; 
    })
    .call(force.drag);

  node.append("title")
    .text(function(d) { return d.name; });

  node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  console.log('node', node);

  force
    .nodes(nodes)
    .links(links)
    // .on("tick", tick)
    .start();

  console.log('force');

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

});
