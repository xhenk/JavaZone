<?php
	$time = $_SERVER['REQUEST_TIME'];
	$ua = $_SERVER['HTTP_USER_AGENT'];
	$name = $_GET['name'];
	$phone = $_GET['phone'];
	$email = $_GET['email'];
	$score = $_GET['score'];

	$file = fopen("scoreboard.xml",  "a");
	fwrite($file, "<entry>\n");
	fwrite($file, "\t<time>$time</time>\n");
	fwrite($file, "\t<useragent>$ua</useragent>\n");
	fwrite($file, "\t<name>$name</name>\n");
	fwrite($file, "\t<phone>$phone</phone>\n");
	fwrite($file, "\t<email>$email</email>\n");
	fwrite($file, "\t<score>$score</score>\n");
	fwrite($file, "</entry>\n");
	fclose($file);
	print("Dine $score poeng er registrert!");
?>





