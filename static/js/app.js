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
var more_colors = ['#4DA6FF', '#4D4DFF', '#A64DFF', '#FF4DFF', '#4DFFFF', '#0F87FF', '#0069D1', '#FF4DA6', '#4DFFA6', '#D16900', '#FF870F', '#FF4D4D', '#4DFF4D', '#A6FF4D', '#FFFF4D', '#FFA64D', '#FFF', '#000']
var genre_colors = colors.concat(more_colors)
var genres = ['randb-soul', 'easy-listening', 'pop', 'dance', 'soundtrack', 'jazz', 'rock', 'compilation', 'electronic', 'electronica', 'downtempo', 'alternative-indie', 'punk', 'alternative', 'reggae', 'dubstep', '2000s', 'live', 'blues', 'house', 'children', 'drum-and-bass', 'pop-rock', 'country', 'folk', 'tech-house', 'hard-rock-metal', 'hip-hop-rap', 'trance', 'spoken-word', 'no-genre', 'techno', 'deep-house', 'holiday']
var DEFAULT_COLOR = '#99ccff';


// node sizes and linear program calculation
var MIN_PAGERANK = 0.000753958309765
var MAX_PAGERANK = 0.0122727168834
var MIN_SCORE = 0.0
var MAX_SCORE = 269.0
var MIN_CENTRALITY = 0.592529925559
var MAX_CENTRALITY = 2.14073322214
var MAX_OCCURENCE = 48
var MIN_OCCURENCE = 11

var MIN_NODE = 5.0
var MAX_NODE = 20.0

var m_pagerank = (MIN_NODE - MAX_NODE) / (MIN_PAGERANK - MAX_PAGERANK)
var b_pagerank = MIN_NODE - MIN_PAGERANK * m_pagerank
var m_score = (MIN_NODE - MAX_NODE) / (MIN_SCORE - MAX_SCORE)
var b_score = MIN_NODE - MIN_SCORE * m_score
var m_centrality = (MIN_NODE - MAX_NODE) / (MIN_CENTRALITY - MAX_CENTRALITY)
var b_centrality = MIN_NODE - MIN_CENTRALITY * m_centrality
var m_occurrence = (MIN_NODE - MAX_NODE) / (MIN_OCCURENCE - MAX_OCCURENCE)
var b_occurence = MIN_NODE - MIN_OCCURENCE * m_occurrence

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

  if (color_scheme == 'none') {
    node.select('circle').style('fill', DEFAULT_COLOR)
  }

  // color by modularity
  if (color_scheme == 'modularity') {
    node.select('circle').style('fill', function(d) { 
      return colors[d.modularity]; 
    })
  }

  // color by genre
  if (color_scheme == 'genre') {
    node.select('circle').style('fill', function(d) { 
      var ind = genres.indexOf(d.genre)
      return genre_colors[ind]; 
    })
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