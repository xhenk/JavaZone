<?php

function fixChars($str) {
	$str = str_replace("�", "&#xE6;", $str);
	$str = str_replace("�", "&#xC6;", $str);
	$str = str_replace("�", "&#xF8;", $str);
	$str = str_replace("�", "&#xD8;", $str);
	$str = str_replace("�", "&#xE5;", $str);
	$str = str_replace("�", "&#xC5;", $str);
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
	echo 'Du m� skrive noe!';
}
?>

