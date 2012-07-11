<?php

function fixChars($str) {
	$str = str_replace("æ", "&#xE6;", $str);
	$str = str_replace("Æ", "&#xC6;", $str);
	$str = str_replace("ø", "&#xF8;", $str);
	$str = str_replace("Ø", "&#xD8;", $str);
	$str = str_replace("å", "&#xE5;", $str);
	$str = str_replace("Å", "&#xC5;", $str);
	return $str;
}

if ($_GET['comm']) {
	$time = $_SERVER['REQUEST_TIME'];
	date_default_timezone_set('Europe/Oslo');
	$time = date('ymd   H:i:s', $time);

	$towrite = '<div id="entry"><div id="time">'.$time.'</div><div id="name">'.fixChars($_GET['name']).'</div><div id="comm">'.fixChars($_GET['comm']).'</div></div>';
	$file = fopen("tips.html", "a");
	fwrite($file, $towrite);
	fclose($file);
} else {
	echo 'Du må skrive noe!';
}
?>

