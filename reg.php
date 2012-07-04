<?php
	$MAX_POINTS = 3;

	$time = $_SERVER['REQUEST_TIME'];
	date_default_timezone_set('Europe/Oslo');
	$time = date('H:i:s', $time);
	$ua = $_SERVER['HTTP_USER_AGENT'];
	$name = $_GET['name'];
	$phone = $_GET['phone'];
	$email = $_GET['email'];
	$score = $_GET['score'];
	$doc = new DOMDocument();

	$doc->load( 'scoreboard.xml' );

	$entries = $doc->getElementsByTagName( "entry" );
	$already = false;
	$nulls = false;
	if (strlen($name) == 0) $nulls = true;
	if (strlen($phone) == 0) $nulls = true;
	if (strlen($email) == 0) $nulls = true;
	foreach( $entries as $entry ) {

		$p = $entry->getElementsByTagName("phone")->item(0)->textContent;
		$e = $entry->getElementsByTagName("email")->item(0)->textContent;

		if (strcmp($p, $phone) == 0) {
			$already = true;
		} else if (strcmp($e, $email) == 0) {
			$already = true;
		}
	}
	if ($score > $MAX_POINTS) {
		print("Du pr�vde &#xE5 snike til deg flere poeng enn det er mulig &#xE5 f&#xE5 til. Juks og fanteri!\n");
		$name = $name." (Tatt for juks!)";
		$score = -1000;
	}
	if ($already) {
		print("Obs: En luring (kanskje deg?) med samme telefonnummer eller epost har allerede konkurrert!<br/>Ikke bruk kunstnernavn eller tulletelefonnummer!");
	} else if ($nulls) {
		print("Obs: En eller flere verdier er ikke utfylt!");
	} else if (strlen($phone) != 8) {
		print("Obs: Vi pr&#xF8vde &#xE5 ringe deg, men telefonnummeret ditt fungerer ikke! Pr&#xF8v &#xE5tte tegn!");
	} else {
		$scoreboard = $doc->getElementsByTagName("scoreboard")->item(0);
		$element = $doc->createElement('entry');
		$scoreboard->appendChild($element);
		$foo = $doc->createElement('time', $time);
		$bar = $doc->createElement('name', $name);
		$baz = $doc->createElement('phone', $phone);
		$qux = $doc->createElement('email', $email);
		$quux = $doc->createElement('score', $score);
		$element->appendChild($foo);
		$element->appendChild($bar);
		$element->appendChild($baz);
		$element->appendChild($qux);
		$element->appendChild($quux);
		$output = $doc->saveXML();
		$file = fopen("scoreboard.xml",  "w");
		fwrite($file, $output);
		fclose($file);
		if ($score == 0) print ("Pinlig, $name. Du fikk $score poeng...");
		else if ($score == $MAX_POINTS) print("Gratulerer, $name, du fikk $score poeng, alt riktig!");
		else print("Gratulerer, $name, du fikk $score poeng!");
	}
?>





