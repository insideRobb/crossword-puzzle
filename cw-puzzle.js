// initialize crossword puzzle
var CW = {
	blank: ".", // standard char for blank fields
	black: "#", // standard char for black fields
	components: [],
	output: []
}
// add a word and its properties, as object, to the crossword puzzle
CW.add = function(i_word, i_definition, i_across, i_row, i_column, i_position) {
	this.components.push({word: i_word, definition: i_definition, across: i_across, row: i_row, column: i_column, position: i_position});
}
// delete all words added
CW.restore = function() {
	this.components = [];
}
// generate output
CW.layout = function() {
	// create WC puzzle filled with NxN black squares
	for(var i = 0, result = [], temp = []; i < this.sizex; i++, temp = []) {
		for(var j = 0; j < this.sizey; j++) {
			temp.push([this.black]);
		}
		result.push(temp);
	}
	var l_components = this.components.length;
	// i cycles every word and its attributes
	for(i = 0; i < l_components; i++) {
		// new var to access quickly
		var currentword = this.components[i];
		// add word position in the layout
		result[currentword["row"]][currentword["column"]][0] = currentword["position"];
		// add as many points as word length, starting from 1 since we already filled 1 square with word position 
		for(j = 1; j < currentword["word"].length; j++) {
			// work horizontally, check if current square is black
			if((currentword["across"] == 0)&&(result[currentword["row"]][currentword["column"] + j] == this.black)) {
				result[currentword["row"]][currentword["column"] + j] = [this.blank];
			}
			// work vertically
			else if((currentword["across"] == 1)&&(result[currentword["row"] + j][currentword["column"]] == this.black)) {				
				// replace only if current square is a black square
			 		result[currentword["row"] + j][currentword["column"]] = [this.blank];
			}
		}
	}
	// merge single blocks into rows
	for(i = 0; i < result.length; i++) {
		result[i] = [].concat.apply([], result[i]);
	}
	// pass result to the object
	this.output = result;
}
