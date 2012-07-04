<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template match="/">
		<html>
			<head>
				<title>SteriaQuiz</title>
				<link rel="stylesheet" type="text/css" href="scoreboard-style.css"/>
			</head>
			<body>
				<center>
				<h2>Deltakerliste Sterias surrequiz 2012</h2>
				<table border="1">
					<tr bgcolor="#f00f00">
						<th>Fornavn</th>
						<th>Telefon</th>
						<th>Epost</th>
						<th>Poengsum</th>
					</tr>
					<xsl:for-each select="scoreboard/entry">
						<xsl:sort data-type="number" select="score" order="descending" />
						<tr>
							<td>
								<xsl:value-of select="substring-before(name,' ')" disable-output-escaping="yes"/>
							</td>
							<td>
								<xsl:value-of select="translate(phone, '12345','*****')"/>
							</td>
							<td>
								<xsl:value-of select="substring-before(email,'@')"/>@********.***
							</td>
							<td>
								<xsl:value-of select="score"/>
							</td>
						</tr>
					</xsl:for-each>
				</table>
				</center>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>