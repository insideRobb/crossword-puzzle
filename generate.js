function play() {
	var currenthtml = $(".table tr#0").html();
	var word = $("input[name='trial']").val();
	var word_l = word.length;
	$(".alert-warning").hide();
	for(var i = 0; i < word_l; i++) {
		if($(".table tr#0 td." + i).text() == localStorage["black"]) {
			$(".alert-warning").toggle("fast");
			i = word_l;
		}
		else if($(".table tr#0 td." + i).text() == localStorage["blank"]) {
			$(".table tr#0 td." + i).text(word[i]);
		}
		else {
			// $(".table tr#0 td." + i).attr("data-name", "
			$(".table tr#0 td." + i).text(" " + word[i]);
		}
		
	}
}

// get input sizes and replace big text
function setsize() {
	var sizes = $(".well input[name='size']").val().split("x");
	// add properties to object and store for future play
	CW.sizex = sizes[0];
	CW.sizey = sizes[1];
	localStorage["sizex"] = sizes[0];
	localStorage["sizey"] = sizes[1];
	localStorage["black"] = CW.black;
	localStorage["blank"] = CW.blank;
	$(".well > h3").text("Generator for " + CW.sizex + "x" + CW.sizey + " Crossword Puzzle")
	$(".word").toggle("slow");
	$(".form-inline").hide();
	event.preventDefault();
}

// based on across/down definition, set word max length (prevent to add words exceeding the layout)
function typefocusout() {
	if($("select[name='type']").find(":selected").attr("value") == 0) {
    	$("input[name='trial']").attr('maxlength', localStorage["sizex"]);
    }
    else {
    	$("input[name='trial']").attr('maxlength', localStorage["sizey"]);
    }
}

// add word to the object, show success message and increment words added counter (useful for user)
function addto() {
	CW.add($(".word input[name='trial']").val(), $(".word input[name='definition']").val(), $(".word select").find(":selected").attr("value"), ($(".word input[name='horizontal']").val() - 1), ($(".word input[name='vertical']").val() - 1), $(".word input[name='symbol']").val());	
	// convert value to integer
	$(".alert-success span").html(+($(".alert-success span").text()) + 1);
	$('.word')[0].reset();
	$(".alert-warning").hide()
	$(".alert-success").hide()
	$(".alert-success").toggle("fast");
	event.preventDefault();
}

// delete every word in the object and show message
function restore() {
	if(CW.components.length > 0) {
		CW.restore();
		$(".alert-success").hide();
		$(".alert-success span").text(0);
		$(".well > h3").after('<div class="alert alert-warning" role="alert">All words have been deleted.</div>');
	}
}

// get layout and print
function generate() {
var layout = CW.layout();
	// if everything is fine and no overlapping
	if(typeof layout === "undefined") {
		var output_n = CW.output.length;
		// create table
		if($(".table").length <= 0) {
			$("hr").after('<table class="table table-bordered"></table>')
		}
		// clear table if already exists
		else {
			$(".table").html("");
		}
		for(i = 0; i < output_n; i++) {
			// create rows
			$(".table").append("<tr id='" + i + "'></tr>");
			var outputi_n = CW.output[i].length;
			for(j = 0; j < outputi_n; j++) {
				// add boxes to rows
				$(".table tr:last-child").append("<td class='" + j + "'>" + CW.output[i][j] + "</td>");
			}
		}
		// save output data and layout without need to reprocess when playing
		localStorage["output"] = document.querySelector(".table").outerHTML;
		localStorage["layout"] = JSON.stringify(CW.output);
	}
	// if overlapping, show alert and delete past table if exists
	else {
		CW.remove(layout);
		$(".well > h3").after('<div class="alert alert-warning" role="alert">Unable to add "' + layout.toUpperCase() + '" to the puzzle due to overlapping, please fix positions (word has been deleted)</div>');
		$(".alert-success").hide();
		$(".table").remove();
	}
}

// get saved data in order to play
function retrieve() {
	$(".well").prepend(localStorage["output"]);
}
