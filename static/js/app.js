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

// node sizes and linear program calculation
var MIN_PAGERANK = 0.000753958309765
var MAX_PAGERANK = 0.0122727168834
var MIN_SCORE = 0.0
var MAX_SCORE = 169.0
var MIN_NODE = 4.0
var MAX_NODE = 16.0
var m_pagerank = (MIN_NODE - MAX_NODE)/ (MIN_PAGERANK - MAX_PAGERANK)
var b_pagerank = MIN_NODE - MIN_PAGERANK * m_pagerank
var m_score = (MIN_NODE - MAX_NODE) / (MIN_SCORE - MAX_SCORE)
var b_score = (MIN_NODE - MIN_SCORE) * m_score

// function that colors the nodes based on modularity or genre
function colorNodes(type, node) {

  var color_scheme = $('#' + type + '-color').val();

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
        return d.pagerank*m_pagerank + b_pagerank
      })
    }

    // size by score
    if (size_scheme == 'score') {
      node.select('circle').attr('r', function(d) {
        var score = d.score*m_score + b_score;
        if (score == 0) {
          return MIN_NODE
        } else {
          return score;
        }
      })
    }
}