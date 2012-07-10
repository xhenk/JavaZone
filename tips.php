<?php
if ($_GET['comm']) {
	$time = $_SERVER['REQUEST_TIME'];
	date_default_timezone_set('Europe/Oslo');
	$time = date('ymd   H:i:s', $time);
	$towrite = '<div id="entry"><div id="time">'.$time.'</div><div id="name">'.$_GET['name'].'</div><div id="comm">'.$_GET['comm'].'</div></div>';
	$file = fopen("tips.html", "a");
	fwrite($file, $towrite);
	fclose($file);
} else {
	echo 'Du må skrive noe!';
}
?>

