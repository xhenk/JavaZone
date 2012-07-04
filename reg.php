<?php
	$time = $_SERVER['REQUEST_TIME'];
	$ua = $_SERVER['HTTP_USER_AGENT'];
	$name = $_GET['name'];
	$phone = $_GET['phone'];
	$email = $_GET['email'];
	$score = $_GET['score'];
	$doc = new DOMDocument();

	$doc->load( 'scoreboard.xml' );

	$entries = $doc->getElementsByTagName( "entry" );
	$already = false;
	foreach( $entries as $entry ) {

		$n = $entry->getElementsByTagName("name")->item(0)->textContent;
		$p = $entry->getElementsByTagName("phone")->item(0)->textContent;
		$e = $entry->getElementsByTagName("email")->item(0)->textContent;
		if (strcmp($n, $name) == 0) {
			$already = true;
		} else if (strcmp($p, $phone) == 0) {
			$already = true;
		} else if (strcmp($e, $email) == 0) {
			$already = true;
		}
	}
	if ($already) {
		print("En med samme navn, telefonnummer eller epost har allerede konkurrert!<br/>Ikke bruk kunstnernavn eller tulletelefonnummer!");
	} else {
		$scoreboard = $doc->getElementsByTagName("scoreboard")->item(0);
		$element = $doc->createElement('entry');
		$scoreboard->appendChild($element);
		$foo = $doc->createElement('name', $name);
		$bar = $doc->createElement('phone', $phone);
		$baz = $doc->createElement('email', $email);
		$qux = $doc->createElement('score', $score);
		$element->appendChild($foo);
		$element->appendChild($bar);
		$element->appendChild($baz);
		$element->appendChild($qux);
		$output = $doc->saveXML();
		$file = fopen("scoreboard.xml",  "w");
		fwrite($file, $output);
		fclose($file);
		print("Dine $score poeng er registrert!");
	}
?>





