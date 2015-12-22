// get input sizes and replace big text
function setsize() {
	var sizes = $(".well input[name='size']").val().split("x");
	CW.sizex = sizes[0];
	CW.sizey = sizes[1];
	$(".well > h3").text("Generator for " + CW.sizex + "x" + CW.sizey + " Crossword Puzzle")
	$(".word").toggle("slow");
	$(".form-inline").hide();
	event.preventDefault();
}

// on across/down definition, set word max length (prevent to add words exceeding the layout)
function typefocusout() {
	if($(".word select").find(":selected").attr("value") == 0) {
    	$(".word input[name='trial']").attr('maxlength', CW.sizex);
    }
    else {
    	$(".word input[name='trial']").attr('maxlength', CW.sizey);
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
	CW.layout();
	var output_n = CW.output.length;
	// create table
	$("hr").after('<table class="table table-bordered"></table>')
	for(i = 0; i < output_n; i++) {
		// create rows
		$(".table").append("<tr></tr>");
		var outputi_n = CW.output[i].length;
		for(j = 0; j < outputi_n; j++) {
			// add boxes to rows
			$(".table tr:last-child").append("<td>" + CW.output[i][j] + "</td>");
		}
	}
	// save output layout without need to reprocess when playing
	localStorage["output"] = document.querySelector(".table").outerHTML;
	// save output data useful when playing
	localStorage["layout"] = JSON.stringify(CW.output);
}
