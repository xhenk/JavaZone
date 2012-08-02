<?php
$MAX_POINTS = 0;
$time = $_SERVER['REQUEST_TIME'];
date_default_timezone_set('Europe/Oslo');
$time = date('H:i:s', $time);
$ua = $_SERVER['HTTP_USER_AGENT'];
$name = $_GET['name'];
$phone = $_GET['phone'];
$email = $_GET['email'];
$answers = $_GET['answers'];
$doc = new DOMDocument();
$correctAnswers = array();

$sliderPlace = -1;
$tmpCnt = 0;

$doc -> load('./Quiz/JavaZone2012.quiz');
$questionElements = $doc -> getElementsByTagName("question");
foreach ($questionElements as $qElem) {

	$theCorrectAnswer = $qElem -> getElementsByTagName("correct") -> item(0) -> textContent;
	$correctAnswers[$tmpCnt] = $theCorrectAnswer;
	// All questions are MAX 3 points
	$MAX_POINTS = $MAX_POINTS + 3;
	$type = $qElem -> getElementsByTagName("type") -> item(0) -> textContent;
	if (strcmp("slider", $type) == 0) {
		$sliderPlace = $tmpCnt;
	}
	$tmpCnt++;
}

$doc->load('scoreboard-private.xml');

$entries = $doc -> getElementsByTagName("entry");
$already = false;
$nulls = false;
if (strlen($name) == 0)
	$nulls = true;
if (strlen($phone) == 0)
	$nulls = true;
if (strlen($email) == 0)
	$nulls = true;
foreach ($entries as $entry) {

	$p = $entry -> getElementsByTagName("phone") -> item(0) -> textContent;
	$e = $entry -> getElementsByTagName("email") -> item(0) -> textContent;

	if (strcmp($p, $phone) == 0) {
		$already = true;
	} else if (strcmp($e, $email) == 0) {
		$already = true;
	}
}
$invalidemail = 0;
if (strpos($email, '@') == NULL) {
	$invalidemail = 1;
} else {
	if (strpos($email, '.') == NULL) {
		$invalidemail = 2;
	}
}
/*
 if ($score > $MAX_POINTS) {
 print("Du pr&#xF8;vde &#xE5 snike til deg flere poeng enn det er mulig &#xE5 f&#xE5 til. Juks og fanteri!\n");
 $name = $name . " (Tatt for juks!)";
 $score = -1000;
 }
 */
if ($already) {
	print("Obs: En luring (kanskje deg?) med samme telefonnummer eller epost har allerede konkurrert!");
} else {

	$score = 0;
	$answArray = explode(';', $answers);

	for ($i = 0; $i < sizeof($correctAnswers); $i++) {
		if ($i == $sliderPlace) {
			$abs = abs(intval($answArray[$i]) - intval($correctAnswers[$i]));
			if ($abs <= 3)
				$score = $score + (3 - $abs);
		} else if (strcmp($answArray[$i], $correctAnswers[$i]) == 0) {
			$score = $score + 3;
		}
	}
	$name = utf8_encode($name);

	$scoreboard = $doc -> getElementsByTagName("scoreboard") -> item(0);
	$element = $doc -> createElement('entry');
	$scoreboard -> appendChild($element);
	$foo = $doc -> createElement('time', $time);
	$bar = $doc -> createElement('name', $name);
	$baz = $doc -> createElement('phone', $phone);
	$qux = $doc -> createElement('email', $email);
	$quux = $doc -> createElement('score', $score);
	$quuux = $doc -> createElement('answers', $answers);

	$element -> appendChild($foo);
	$element -> appendChild($bar);
	$element -> appendChild($baz);
	$element -> appendChild($qux);
	$element -> appendChild($quux);
	$element -> appendChild($quuux);

	/* Write all information to private score board */
	$output = $doc -> saveXML();
	$file = fopen("scoreboard-private.xml", "w");
	fwrite($file, $output);
	fclose($file);


	$doc -> load('scoreboard.xml');
	$scoreboard = $doc -> getElementsByTagName("scoreboard") -> item(0);
	$element = $doc -> createElement('entry');
	$scoreboard -> appendChild($element);
	$foo = $doc -> createElement('time', $time);
	$bar = $doc -> createElement('name', $name);
	$quux = $doc -> createElement('score', $score);

	$element -> appendChild($foo);
	$element -> appendChild($bar);
	$element -> appendChild($quux);

	/* Write all information to public score board */
	$output = $doc -> saveXML();
	$file = fopen("scoreboard.xml", "w");
	fwrite($file, $output);
	fclose($file);


	if ($score == 0)
		print("Pinlig, $name. Du fikk $score poeng...");
	else if ($score == $MAX_POINTS)
		print("Gratulerer, $name, du fikk $score poeng, alt riktig!");
	else
		print("Gratulerer, $name, du fikk $score poeng!");
}
?>

