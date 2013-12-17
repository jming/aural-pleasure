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
    height = 450;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .gravity(1)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("#artist-d3").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append('g')
    .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
    .append("g");

function zoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// function to resume playing sim
function resume_artists_network(){
  force.start();
  $('#start-artist-network').attr( "onclick", "pause_artists_network();" );
  $('#start-artist-network').html('<span class="glyphicon glyphicon-pause"></span> Pause');
}

// function to stop playing sim
function pause_artists_network(){
  force.stop();
  $('#start-artist-network').attr( "onclick", "resume_artists_network();" );
  $('#start-artist-network').html('<span class="glyphicon glyphicon-play"></span> Resume');
}


// function to start playing sim
function start_artists_network(){

  // alert('starting!');

  $('#start-artist-network').attr( "onclick", "pause_artists_network();" );
  $('#start-artist-network').html('<span class="glyphicon glyphicon-pause"></span> Pause');
  $.getJSON("../static/js/artist_graph.json", function(data) {

    // get nodes and links
    var nodes = data.nodes
    var links = data.edges

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

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
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
      d3.select(this).select("circle")
        .transition().duration(200)
        .attr("r", 16);
      d3.select(this).select('text').transition()
        .duration(200)
        .style({opacity: 1.0});
    }

    // function to handle mouseout shrinking of circle and hiding of text
    function mouseout() {
      d3.select(this).select('text')
        .transition().duration(200)
        .style({opacity: 0.0});
      sizeNodes('artist', node);
    }

  });
}


