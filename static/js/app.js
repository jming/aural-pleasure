/***********************************************************
* 
* The Truth Behind Aural Pleasure
* CS109 Final Project
* Jennifer Chen, Joy Ming, and Ryan Lee
*
* app.js
* code that sets up the groundwork for d3 graphs
* 
************************************************************/

// basic color schemes for the nodes
var colors = ['#9CF', '#FC9', '#FC9', '#99F', '#C9F', '#F9F', '#9FF', '#5CADFF', '#1F8FFF', '#F9C', '#9FC', '#F8F1F', '#FFAD5C', '#F99', '#9F9', '#CF9', '#FF9', '#FC9', '#FC9']
var colors_num = d3.range(colors.length)
var colors_basic = d3.scale.ordinal().range(colors)
var more_colors = ['#4DA6FF', '#4D4DFF', '#A64DFF', '#FF4DFF', '#4DFFFF', '#0F87FF', '#0069D1', '#FF4DA6', '#4DFFA6', '#D16900', '#FF870F', '#FF4D4D', '#4DFF4D', '#A6FF4D', '#FFFF4D', '#FFA64D', '#FFF', '#000']
var genre_colors = colors.concat(more_colors)
var genres = ['randb-soul', 'easy-listening', 'pop', 'dance', 'soundtrack', 'jazz', 'rock', 'compilation', 'electronic', 'electronica', 'downtempo', 'alternative-indie', 'punk', 'alternative', 'reggae', 'dubstep', '2000s', 'live', 'blues', 'house', 'children', 'drum-and-bass', 'pop-rock', 'country', 'folk', 'tech-house', 'hard-rock-metal', 'hip-hop-rap', 'trance', 'spoken-word', 'no-genre', 'techno', 'deep-house', 'holiday']
var DEFAULT_COLOR = '#99ccff';

jsgradient = {
  inputA : '',
  inputB : '',
  inputC : '',
  gradientElement : '',
  
  // Convert a hex color to an RGB array e.g. [r,g,b]
  // Accepts the following formats: FFF, FFFFFF, #FFF, #FFFFFF
  hexToRgb : function(hex){
    var r, g, b, parts;
      // Remove the hash if given
      hex = hex.replace('#', '');
      // If invalid code given return white
      if(hex.length !== 3 && hex.length !== 6){
          return [255,255,255];
      }
      // Double up charaters if only three suplied
      if(hex.length == 3){
          hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      }
      // Convert to [r,g,b] array
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);

      return [r,g,b];
  },
  
  // Converts an RGB color array e.g. [255,255,255] into a hexidecimal color value e.g. 'FFFFFF'
  rgbToHex : function(color){
    // Set boundries of upper 255 and lower 0
    color[0] = (color[0] > 255) ? 255 : (color[0] < 0) ? 0 : color[0];
    color[1] = (color[1] > 255) ? 255 : (color[1] < 0) ? 0 : color[1];
    color[2] = (color[2] > 255) ? 255 : (color[2] < 0) ? 0 : color[2];
    
    return this.zeroFill(color[0].toString(16), 2) + this.zeroFill(color[1].toString(16), 2) + this.zeroFill(color[2].toString(16), 2);
  },
  
  // Pads a number with specified number of leading zeroes
  zeroFill : function( number, width ){
    width -= number.toString().length;
    if ( width > 0 ){
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number;
  },

  // Generates an array of color values in sequence from 'colorA' to 'colorB' using the specified number of steps
  generateGradient : function(colorA, colorB, steps){
    var result = [], rInterval, gInterval, bInterval;
    
    colorA = this.hexToRgb(colorA); // [r,g,b]
    colorB = this.hexToRgb(colorB); // [r,g,b]
    steps -= 1; // Reduce the steps by one because we're including the first item manually
    
    // Calculate the intervals for each color
    rStep = ( Math.max(colorA[0], colorB[0]) - Math.min(colorA[0], colorB[0]) ) / steps;
    gStep = ( Math.max(colorA[1], colorB[1]) - Math.min(colorA[1], colorB[1]) ) / steps;
    bStep = ( Math.max(colorA[2], colorB[2]) - Math.min(colorA[2], colorB[2]) ) / steps;
  
    result.push( '#'+this.rgbToHex(colorA) );
    
    // Set the starting value as the first color value
    var rVal = colorA[0],
      gVal = colorA[1],
      bVal = colorA[2];
  
    // Loop over the steps-1 because we're includeing the last value manually to ensure it's accurate
    for (var i = 0; i < (steps-1); i++) {
      // If the first value is lower than the last - increment up otherwise increment down
      rVal = (colorA[0] < colorB[0]) ? rVal + Math.round(rStep) : rVal - Math.round(rStep);
      gVal = (colorA[1] < colorB[1]) ? gVal + Math.round(gStep) : gVal - Math.round(gStep);
      bVal = (colorA[2] < colorB[2]) ? bVal + Math.round(bStep) : bVal - Math.round(bStep);
      result.push( '#'+this.rgbToHex([rVal, gVal, bVal]) );
    };
    
    result.push( '#'+this.rgbToHex(colorB) );
    
    return result;
  },
  
  gradientList : function(colorA, colorB, list){
    var list = (typeof list === 'object')? list : $(list),
      listItems = list.find('li'),
      steps  = listItems.length,
      colors = jsgradient.generateGradient(colorA, colorB, steps);
    listItems.each(function(i){
      $(this).css('backgroundColor', colors[i]);
    });
  }
}
// var color_gradient = jsgradient.generateGradient('#E6E6FF', '#00004C', 32);
var color_gradient = jsgradient.generateGradient('#00004C','#E6E6FF', 32);
console.log(color_gradient);


// node sizes and linear program calculation
var MIN_PAGERANK = 0.000753958309765
var MAX_PAGERANK = 0.0122727168834
var MIN_SCORE = 0.0
var MAX_SCORE = 269.0
var MIN_CENTRALITY = 0.592529925559
var MAX_CENTRALITY = 2.14073322214
var MAX_OCCURENCE = 48
var MIN_OCCURENCE = 11

var MIN_NODE = 4.0
var MAX_NODE = 18.0

var m_pagerank = (MIN_NODE - MAX_NODE) / (MIN_PAGERANK - MAX_PAGERANK)
var b_pagerank = MIN_NODE - MIN_PAGERANK * m_pagerank
var m_score = (MIN_NODE - MAX_NODE) / (MIN_SCORE - MAX_SCORE)
var b_score = MIN_NODE - MIN_SCORE * m_score
var m_centrality = (MIN_NODE - MAX_NODE) / (MIN_CENTRALITY - MAX_CENTRALITY)
var b_centrality = MIN_NODE - MIN_CENTRALITY * m_centrality
var m_occurrence = (MIN_NODE - MAX_NODE) / (MIN_OCCURENCE - MAX_OCCURENCE)
var b_occurrence = MIN_NODE - MIN_OCCURENCE * m_occurrence

function calcSize(min, max, x) {
  var m = (MIN_NODE - MAX_NODE) / (min - max)
  var b = MIN_NODE - min * m
  var ans = m*x + b
  ans = (ans == 0) ? MIN_NODE : ans
  // console.log(m,x,b,ans)
  return (m,b)
}



// function that colors the nodes based on modularity or genre
function colorNodes(type, node) {

  var color_scheme = $('#' + type + '-color').val();
  var selected_svg = (type == 'artist') ? svg : svg_playlist;

  if (color_scheme == 'none') {
    node.select('circle').style('fill', DEFAULT_COLOR);
    selected_svg.selectAll('.legend').remove();
  }

  // color by modularity
  if (color_scheme == 'modularity') {

    node.select('circle').style('fill', function(d) { 
      return colors[d.modularity]; 
    });

    selected_svg.selectAll('.legend').remove();

    var legend = selected_svg.selectAll(".legend")
      .data(d3.range(colors.length))
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
          return colors[d];
        });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
  }

  // color by genre
  if (color_scheme == 'genre') {
    node.select('circle').style('fill', function(d) { 
      var ind = genres.indexOf(d.genre)
      return genre_colors[ind]; 
    });

    selected_svg.selectAll('.legend').remove();

    var legend = selected_svg.selectAll(".legend")
      .data(genres)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
          var ind = genres.indexOf(d)
          return genre_colors[ind];
        });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
  }

  if (color_scheme == 'year') {
    node.select('circle').style('fill', function(d) {
      console.log(d.year, color_gradient[d.year-1982]);
      return color_gradient[d.year-1982];
    });

    selected_svg.selectAll('.legend').remove();

    var legend = selected_svg.selectAll(".legend")
      .data(d3.range(1982,2012))
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
          return color_gradient[d-1982];
        });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
  }
}

// function that sizes the nodes based on pagerank or score
function sizeNodes(type, node) {

    var size_scheme = $('#' + type + '-size').val()

    // default size scheme
    if (size_scheme == 'none') {
      node.select('circle').attr('r', MIN_NODE);
    }

    // size by pagerank
    if (size_scheme == 'pagerank') {
      node.select('circle').attr('r', function(d) {
        var ans = m_pagerank * d.pagerank + b_pagerank
        // console.log(d.pagerank, m_pagerank, b_pagerank);
        return (ans == 0) ? MIN_NODE : ans
      })
    }

    // size by score
    if (size_scheme == 'score') {
      node.select('circle').attr('r', function(d) {
        var ans = m_score * d.score + b_score
        return (ans == 0) ? MIN_NODE : ans 
      })
    }

    if (size_scheme == 'cent') {
      node.select('circle').attr('r', function(d) {
        var ans = m_centrality * d.centrality + b_centrality
        return (ans == 0) ? MIN_NODE : ans 
      })
    }

    if (size_scheme == 'occ') {
      node.select('circle').attr('r', function(d) {
        var ans = m_occurrence * d.occ + b_occurrence
        return (ans == 0) ? MIN_NODE : ans
      })
    }
}