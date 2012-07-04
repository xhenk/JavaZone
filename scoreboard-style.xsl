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
					<h1 id="h1heading">Deltakerliste Sterias surrequiz 2012</h1>
					<table id="tab" summary="Deltakerliste Sterias surrequiz 2012">
						<thead>
							<tr>
								<th scope="col" class="rounded-company">Levert</th>
								<th scope="col" class="rounded-q1">Fornavn</th>
								<th scope="col" class="rounded-q2">Telefon</th>
								<th scope="col" class="rounded-q3">Epost</th>
								<th scope="col" class="rounded-q4">Poengsum</th>
							</tr>
						</thead>
						<tfoot>
							<tr>
								<td class="rounded-foot-left"></td>
								<td colspan="3">
									<!-- sensurert <em>Resultatlisten er sensurert! Det ser iallefall slik ut.</em> -->
									<em>Personinformasjon lagres hos Steria fram til trekningen.</em>
								</td>
								<td class="rounded-foot-right"></td>
							</tr>
						</tfoot>
						<tbody>
							<xsl:for-each select="scoreboard/entry">
								<xsl:sort data-type="number" select="score" order="descending" />
								<tr>
									<td>
										<xsl:value-of select="time" />
									</td>
									<td>
										<!-- sensurert <xsl:value-of select="substring-before(name,' ')" disable-output-escaping="yes"/> -->
										<xsl:value-of select="name" />
									</td>
									<td>
										<!-- sensurert <xsl:value-of select="translate(phone, '12345','*****')"/> -->
										<xsl:value-of select="phone"/>
									</td>
									<td>
										<!--<xsl:value-of select="substring-before(email,'@')"/>@********.*** -->
										<xsl:value-of select="email"/>
									</td>
									<td>
										<xsl:value-of select="score"/>
									</td>
								</tr>
							</xsl:for-each>
						</tbody>
					</table>
					<img src="Sencha/sterialogo.gif" /> 
				</center>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>