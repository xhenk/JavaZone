<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template match="/">
		<html>
			<head>
				<title>SteriaQuiz</title>
				<link rel="stylesheet" type="text/css" href="scoreboard-style.css"/>
				<script src="scoreboard.js" />
			</head>
			<body>
				<center>
					<table id="smallborder">
						<tr>
							<td>
								<div id="padding"></div>
							</td>
							<td id="h1heading">Deltakerliste Sterias surrequiz 2012</td>
						</tr>
					</table>
					<div id="padding"></div>
					<div id="winnerheading"></div>
					<div id="tabcontainer">
						<table id="tab" summary="Deltakerliste Sterias surrequiz 2012">
							<thead>
								<tr>
									<th scope="col" class="left">Levert</th>
									<th scope="col">Navn</th>
									<th scope="col" class="right">Poengsum</th>
								</tr>
							</thead>
							<tfoot>
								<tr>
									<td>&#160;</td>
									<td>
										<em>Personinformasjon lagres hos Steria fram til trekningen.</em>
									</td>
									<td class="rounded-foot-right"></td>
								</tr>
							</tfoot>
							<tbody>
								<xsl:for-each select="scoreboard/entry">
									<xsl:sort data-type="number" select="score" order="descending" />
									<tr><xsl:attribute name="id">tf<xsl:value-of select="position()"/></xsl:attribute>
										<td>
											<xsl:value-of select="time" />
										</td>
										<td>
											<xsl:value-of select="substring(name, 0, 2)"/>.&#160;
											<xsl:value-of select="substring-after(name,' ')"/>
										</td>
										<td>
											<div style="text-align: right;">
												<xsl:value-of select="score"/>
											</div>
										</td>
									</tr>
								</xsl:for-each>
							</tbody>
						</table>
					</div>
					<p>
						Uavgjort?
						<button onClick="drawWinner()">Trekk en vinner</button>
						(uferdig)
					</p>
					<p>
						<img src="Sencha/sterialogo.gif" />
					</p>
				</center>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>