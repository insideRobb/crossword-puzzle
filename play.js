// - spiegare tutti i metodi (di accesso) alle strutture di dati con commenti
// - spiegare il programma in termini di velocità, spazio e le procedure per manipolare i dati
// - giocare (max 2 suggerimenti, inserisci parola solo se valida)
// - verificare all'aggiunta della parola che fili tutto liscio con le lettere

function retrieve() {
	$(".well").append(localStorage["output"]);
}

$(document).ready(function() {
	retrieve();
});
