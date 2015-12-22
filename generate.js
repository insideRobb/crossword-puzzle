function play() {
	$(".alert-warning").hide();
	var crossdown = $("select[name='type']").find(":selected").attr("value");
	var current = $("td#" + $('input[name=\'symbol\']').val());
	var current_html = current.parent().html();
	var word = $("input[name='trial']").val();
	var word_l = word.length;
	for(var i = 0; i < word_l; i++) {
		if(current.text() == localStorage["black"]) {
			$(".alert-warning").toggle("fast");
			current.parent().html(current_html)
			i = word_l;
		}
		else if(current.text() == localStorage["blank"]) {
			current.text(word[i].toLowerCase());
		}
		else {
			current.text(" " + word[i].toLowerCase());
		}
		// get next element based on across/down property
		if(crossdown == 0) {
			current = current.next();
		}
		else {
			current = current.parent().next().children().eq(current.index());
		}
	}
	event.preventDefault();
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
	CW.add($(".word input[name='trial']").val(), $(".word input[name='definition']").val(), $(".word select").find(":selected").attr("value"), ($(".word input[name='horizontal']").val() - 1), ($(".word input[name='vertical']").val() - 1), $(".word input[name='symbol']").val().toUpperCase);	
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

// get layout
function generate() {
var layout = CW.layout();
	// if everything is fine and no overlapping
	if(typeof layout === "undefined") {
		var cwdata = [];
		var components_l = CW.components.length;
		// if there are components, saving memory
		if(components_l > 0) {
			for(var i = 0; i < components_l; i++) {
				cwdata.push({across: CW.components[i]["across"], position: CW.components[i]["position"], definition: CW.components[i]["definition"], length: CW.components[i]["word"].length, column: CW.components[i]["column"], row: CW.components[i]["row"]});
			}
			var output_l = CW.output.length;
			var table = '<table class="table table-bordered">';
			for(i = 0; i < output_l; i++) {
				// create rows
				table+="<tr>";
				var outputi_l = CW.output[i].length;
				for(var j = 0; j < outputi_l; j++) {
					// add boxes to rows
					table+= "<td";
					if((CW.output[i][j] != CW.blank)&&(CW.output[i][j] != CW.black)) {
						table+=" id='" + CW.output[i][j] + "'";
					}
					table+=">" + CW.output[i][j] + "</td>";
				}
				table+="</tr>";
			}
			table+="</table>";
			// save output data and layout without need to reprocess when playing
			localStorage["output"] = table;
			localStorage["data"] = JSON.stringify(cwdata);
			location.href = "play.html";
		}
		else {
			$(".alert-warning").hide();
			$(".well > h3").after('<div class="alert alert-warning" role="alert">Please add words!</div>');
		}
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
	$(".alert").after(localStorage["output"]);
	var data = JSON.parse(localStorage["data"]);
	var data_n = data.length;
	for(var i = 0; i < data_n; i++) {
		if(data[i]["across"] == 0) {
			var element = $("#across");
		}
		else {
			var element = $("#down");
		}
		element.append('<li><strong>' + data[i]["position"] + '</strong>: ' + data[i]["definition"] + '</li>');
	}
}

// enable word field (last field where to type)
function unlock() {
	if($('input[name="symbol"]').val().length > 0) {
		$('input[name="trial"]').removeAttr('disabled');
		$('input[name="trial"]').attr('placeholder', 'Type your guess...');
	}
}
