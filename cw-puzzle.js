// initialize crossword puzzle
var CW = {
	blank: ".", // standard char for blank fields
	black: "#", // standard char for black fields
	components: [],
	output: []
}
// add a word and its properties, as object, to the crossword puzzle
CW.add = function(i_word, i_definition, i_across, i_row, i_column, i_position) {
	this.components.push({word: i_word.toLowerCase(), definition: i_definition, across: i_across, row: i_row, column: i_column, position: i_position});
}
// delete one word from components
CW.remove = function(x) {
	var components = this.components;
	var components_l = this.components.length;
	for(var i = 0; i < components_l; i++) {
		if(components[i]["word"] == x) {
			this.components.splice(i);
		}
	}
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
		var currentword = this.components[i];
		// check if current square is black or has same letter, fill with proper letter
		for(j = 0; j < currentword["word"].length; j++) {
			// work horizontally
			if((currentword["across"] == 0)&&((result[currentword["row"]][currentword["column"] + j] == this.black)||(result[currentword["row"]][currentword["column"] + j] == currentword["word"][j]))) {
				result[currentword["row"]][currentword["column"] + j] = currentword["word"][j];
			}
			// work vertically
			else if((currentword["across"] == 1)&&((result[currentword["row"] + j][currentword["column"]] == this.black)||(result[currentword["row"] + j][currentword["column"]] == currentword["word"][j]))) {				
			 	result[currentword["row"] + j][currentword["column"]] = currentword["word"][j];
			}
			// if error
			else {
				return currentword["word"];
			}
		}
	}
	// now replace letters with index or dots
	for(i = 0; i < l_components; i++) {
		currentword = this.components[i];
		// add dots
		for(j = 0; j < currentword["word"].length; j++) {
			// work horizontally
			if(currentword["across"] == 0) {
				var current_xy = result[currentword["row"]][currentword["column"] + j];
				if ((typeof current_xy === "string")&&(current_xy == current_xy.toLowerCase())) {
					result[currentword["row"]][currentword["column"] + j] = this.blank;
				}
			}
			// work vertically
			else if(currentword["across"] == 1) {
				var current_xy = result[currentword["row"] + j][currentword["column"]];		
				if ((typeof current_xy === "string")&&(current_xy == current_xy.toLowerCase())) {
			 		result[currentword["row"] + j][currentword["column"]] = this.blank;
			 	}
			}
		}
		// add word position in the layout (multiple words starts in one box supported)
		current_xy = result[currentword["row"]][currentword["column"]];
		if(((typeof current_xy == "string")&&(current_xy == current_xy.toUpperCase())&&(current_xy != this.blank))||((typeof current_xy == "number")&&(current_xy != currentword["position"]))) {
			result[currentword["row"]][currentword["column"]]+= "|" + currentword["position"];
		}
		else {
			result[currentword["row"]][currentword["column"]] = currentword["position"];
		}
	}
	// merge single blocks into rows
	for(i = 0; i < result.length; i++) {
		result[i] = [].concat.apply([], result[i]);
	}
	// pass result to the object
	this.output = result;
}
