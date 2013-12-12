
var width_playlist = 600,
    height_playlist = 500;

var color_playlist = d3.scale.category20();

// var force_playlist = d3.layout.force()
//     .charge(-1000)
//     .gravity(1)
//     .linkDistance(250)
//     .size([width_playlist, height_playlist]);

var force_playlist = d3.layout.force()
    // .charge(-10)
    // .gravity(0.1)
    .charge( -300)
    .gravity(1)
    // .linkDistance(250)
    .linkDistance(function(d) {
      return d.target._children ? 100 : 30;
    })
    // .linkStrength(10)
    // .linkStrength(function(d) {
      // return 1./2*(d.value);
    // })
    .size([width_playlist, height_playlist]);

var svg_playlist = d3.select("#playlist-d3").append("svg")
    .attr("width", width_playlist)
    .attr("height", height_playlist);

// var colors = ['#3366FF', '#6633FF', '#C3F', '#F3C', '#3CF', '#003DF5', '#002EB8', '#F36', '#3FC', '#B88A00', '#F5B800', '#F63', '#3F6', '#6F3', '#CF3', '#FC3', '#FF3', '#3FC'];

// var colors = ['#9CF', '#FC9', '#FC9', '#99F', '#C9F', '#F9F', '#9FF', '#5CADFF', '#1F8FFF', '#F9C', '#9FC', '#F8F1F', '#FFAD5C', '#F99', '#9F9', '#CF9', '#FF9', '#FC9', '#FC9']

d3.xml("../static/resources/songs_top_attr.gexf", "application/xml", function(gexf) {
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
      occ: attrs[1].getAttribute('value'),
      score: attrs[2].getAttribute('value'),
      modularity: attrs[3].getAttribute('value'),
      year: attrs[4].getAttribute('value')
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

  var link = svg_playlist.selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .style("stroke-width", function(d) { return 0.1*Math.sqrt(d.value); });

  // console.log('link', link);

  // var MIN_PAGERANK = 0.000753958309765
  // var MAX_PAGERANK = 0.0122727168834
  // var MIN_NODE = 3.
  // var MAX_NODE = 15.
  // var m = (MIN_NODE - MAX_NODE)/ (MIN_PAGERANK - MAX_PAGERANK)
  // var b = MIN_NODE - MIN_PAGERANK * m
  // console.log(m,b)

  var node = svg_playlist.selectAll('.node')
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    // .attr("r", 5)
    .attr('r', function(d) {
      // console.log(d.pagerank, d.pagerank*m + b)
      return 5;
    })
    // .style("fill", function(d) { return color(d.group); })
    .style('fill', function(d) { 
      // console.log(d.modularity)
      return colors[d.modularity]; 
    })
    .call(force_playlist.drag);

  node.append("title")
    .text(function(d) { return d.name; });

  node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  console.log('node', node);

  force_playlist
    .nodes(nodes)
    .links(links)
    // .on("tick", tick)
    .start();

  console.log('force');

  force_playlist.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  $('#playlist-color').on('change', function() {
    // alert('red!');
    var color_scheme = $(this).val()
    // alert(color_scheme);
    if (color_scheme == 'modularity') {
      node.style('fill', function(d) { 
        // console.log(d.modularity)
        return colors[d.modularity]; 
      })
    }
    if (color_scheme == 'genre') {
      node.style('fill', function(d) { 
        // console.log(d.modularity)
        var ind = genres.indexOf(d.genre)
        return genre_colors[ind]; 
      })
    }
  })

  $('#playlist-size').on('change', function() {
    // alert('red!');
    var size_scheme = $(this).val()
    // alert(size_scheme);
    // if (size_scheme == 'pagerank') {
    //   node.attr('r', function(d) {
    //     // console.log(d.pagerank, d.pagerank*m + b)
    //     return d.pagerank*m_pagerank + b_pagerank
    //   })
    // }
    if (size_scheme == 'none') {
      return 5;
    }
    if (size_scheme == 'score') {
      node.attr('r', function(d) {
        // console.log(d.pagerank, d.pagerank*m + b)
        var score = d.score*m_score + b_score;
        if (score == 0) {
          return MIN_NODE
        } else {
          return score;
        }
      })
    }
  })

});
