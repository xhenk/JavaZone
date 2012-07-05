var contestants;
var secondRound;
var maxWait = 400;
var winner = -1;

var rowData = 0;
var rows = 0;

function drawWinner() {
	contestants = new Array();
	secondRound = new Array();
	rowData = document.getElementById("tab").getElementsByTagName("tr");
	// Get the number of rows in the table minus header and footer that have the
	// highest score
	rows = rowData.length;
	var highScore = 0;
	// rowData contains [header][footer][entry1]...[entryN]
	for ( var i = 2; i < rows; i++) {
		var score = parseInt(rowData[i].getElementsByTagName("td")[4].getElementsByTagName("div")[0].innerHTML);
		contestants[i - 2] = score; // Log row number of eligible contestants
	}
	// Find high score
	for ( var i = 0; i < contestants.length; i++) {
		if (contestants[i] > highScore) {
			highScore = contestants[i];
		}
	}
	// console.log(highScore + ' is highScore');
	// Find contestants with high score
	var len = contestants.length;
	for ( var i = 0; i < len; i++) {
		if (contestants[i] == highScore) {
			// Those with enough points make it to the second round.
			secondRound.push(i);
			// console.log(i + ' made it');
		}
	}
	// console.log('=== With highscores: === ' + secondRound.length);
	// for (var i = 0; i < secondRound.length; i++) {
	// console.log(secondRound[i]);
	// }

	// Winner selected between 1 and #rows
	winner = (Math.floor(Math.random() * secondRound.length) + 1);
	secondRound.pop(winner);
	// console.log(winner + ' won');
	highlightLosers();
	setTimeout("highlight(" + winner + ");", maxWait + 600);
	

}

/**
 * Highlights the selected table line.
 */
function highlight(number) {
	// console.log('Winner is highlighted: ' + number);
	// number+1 to avoid header
	var winnerItem = document.getElementById("tab").getElementsByTagName("tr")[number + 1].getElementsByTagName("td");
	document.styleSheets[0].insertRule('#tr' + (number) + ' { text-shadow: red 0em 0em 1em; text-transform:uppercase; height:100px; font-size: 2em}',
			document.styleSheets[0]['rules'].length);
	document.getElementById("winnerheading").innerHTML = winnerItem[1].innerHTML + ' vant med ' + winnerItem[4].getElementsByTagName("div")[0].innerHTML + ' poeng!';
	
}

/**
 * Highlights losers with black loser-colour!
 */
function highlightLosers() {
	console.log('Highlighting losers: ' + rows);
	var rnd = 0;
	for ( var i = 1; i < rows; i++) {
		if (i !== winner) {
			rnd = (Math.floor(Math.random() * 1000) + 100);
			console.log('loser: ' + i + ' waits ' + rnd + ' for highlight');
			if (rnd > maxWait) {
				maxWait = rnd;
			}
			setTimeout("document.styleSheets[0].insertRule('#tr" + i
					+ " { text-shadow: black 0em 0em 2em; }', document.styleSheets[0]['rules'].length);", rnd);
		}
	}
}
