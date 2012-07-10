<!DOCTYPE HTML>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="stil.css"/>
		<script type="text/javascript">
			function loadComments() {
				var fileContents = '';
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open('GET', 'tips.html', true);
  				xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
				xmlhttp.send(null);
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4) {
						document.getElementById('comments').innerHTML = xmlhttp.responseText;
					}
				}
			}

			function sendComment() {
				var comment = document.getElementById('commbox').value;
				console.log('comment: ' + comment);
				var name = document.getElementById('navn').value;
				console.log('name: ' + name);
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open('GET', 'tips.php?comm=' + comment + '&name=' + name, true);
  				xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
				xmlhttp.send(null);
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4) {
						console.log('Svar fra ' + 'tips.php?comm=' + comment + '&name=' + name + '\n' + xmlhttp.responseText);
						document.getElementById('commbox').value = xmlhttp.responseText;
						window.location.reload();
					}
				}
			}
		</script>
	</head>
	<body onLoad="loadComments();">
		<table>
			<tr>
				<td><h1>God dag.</h1>
				<p>
					<strong>Dette er hva JavaZone-profileringsgruppa foretar seg for tiden:</strong>
				</p>
				<p>
					En <a href="./Sencha/app.html">quiz</a> til JavaZone! (som bare st�tter Chrome eller mobilnettleser!)
					<br/>
					Ta quizen og se hvor du ender opp p� <a href="scoreboard.xml">resultatlisten</a>! Hurra!
					<br/>
				</p>
				<p>
					En robot som kaster godteri (denne kan bes�kes i 22. etg. i hj�rnet mot Bygd�y)
				</p><p></p><td width=400>&nbsp; </td>
				<td>
				<p>
					Vi har et <a href="http://klevjers.com/temp/IMG_0310.JPG">bilde</a> og en <a href="http://klevjers.com/temp/VIDEO0005.mp4">video</a> ogs�, for alle som er veldig interessert i lego.
				</td>
			</tr>
			<tr>
				<td>
				<p>
					<small>Tips mottas med takk!</small>
				</p>
				<input type="text" id="commbox" name="comment" size="50" />
				<input type="text" name="name" id="navn" value="navn" size="20" />
				<button type="button" onClick="sendComment()">
					Tips!
				</button><div id="comments"></div></td>
				</td>
			</tr>
		</table>
	</body>
</html>