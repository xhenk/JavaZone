var titlebar;
var currentPage;
var firstPage;
var menuBtn;
var carousel;
var regPage;

/**
 * All Map-related variables. Requires one set per map-question!
 */
var mapPage;
var gmap;
var marker;
var cap;
var flat, flng;
var CORR_lat, CORR_lng;
var THRESH;
var mapCenter;
var lastEvent = new Date();
var mapQnum = 'Sp¯rsmÂl ';
var mapQQ;

var allOrdinaryRadioButtonQuestions = new Array();
/* Correct answers to all ordinary radio button questions */
var allOrdinaryRadioButtonCorrectAnswers = new Array();

var regPath = '../reg.php?';
var globAnsCnt = 0;
var globQuestCnt = 0;
var numOrdQuestions = 0;

Ext.application({
	name : 'SteriaQuiz',

	launch : function() {
		titlebar = createTitlebar();
		firstPage = createFirstPage();
		regPage = createRegPage();
		carousel = createCarousel();
		createQuestionsCarousel('../Quiz/JavaZone2012.quiz');
		mapPage = createMapPage();
		// addQuestionToCarousel('Question 1', 'Answer 1', 'Answer 2', 'Answer
		// 3', 'Answer 4', 0);
		switchTo(firstPage);
	}
});

function switchTo(to) {

	if (currentPage && currentPage == to)
		return;

	Ext.Viewport.add(to);

	Ext.Viewport.setActiveItem(to);
	currentPage = to;

}

function createTitlebar() {

	return new Ext.TitleBar({
		docked : 'top',
		title : 'SteriaQuiz',
		items : [ {
			iconCls : 'home',
			iconMask : true,
			align : 'right',
			listeners : {
				tap : function() {
					switchTo(firstPage);
				}
			}
		} ]
	});
}
function createMapPage(question) {

	var pos = new google.maps.LatLng(65.83878, 13.88672);
	var x = (document.height - 75);
	gmap = Ext.create('Ext.Map', {
		xtype : 'map',
		useCurrentLocation : false,
		height : 600, // TODO!!!
		mapOptions : {
			center : pos,
			zoom : 4
		},
		listeners : {
			centerchange : function(comp, map) {
				mapCenter = map.getCenter();
				delay(handleMovement());
			},
			maprender : function(comp, map) {
				setTimeout(function() {
					map.panTo(pos);
				}, 1000);
			},

		}
	});
	var mapPanel = new Ext.Panel({
		iconCls : 'map',
		title : 'Map',
		ui : 'light',
		items : [ {
			xtype : 'container',
			items : gmap
		}, {
			xtype : 'button',
			text : 'Forn¯yd',
			docked : 'bottom',
			listeners : {
				tap : function(button, event) {
					titlebar.setTitle("SteriaQuiz");
					switchTo(carousel);
				}
			}
		} ]
	});

	return mapPanel;
}
function handleMovement() {
	if (lastEvent.getTime() + 500 > new Date().getTime())
		return;
	var _map = gmap.getMap();
	if (marker) {
		marker.setMap(null);
	}
	marker = new google.maps.Marker({
		position : mapCenter,
		title : mapCenter.toString(),
		map : _map,
		listeners : {
			click : function(me) {
				console.log('foo');
				var locationBubble = new google.maps.InfoWindow();
				locationBubble.setContent(_map.getCenter().toString);
				locationBubble.open(gmap, marker);
			}
		}
	});
	if (cap) {
		cap.setMap(null);
	}
	// Add circle overlay and bind to marker
	cap = new google.maps.Circle({
		map : _map,
		radius : 150,
		clickable : false,
		fillOpacity : 0.3,
		strokeWeight : 1,
		strokeColor : '#DD0000',
		fillColor : '#AA0000'
	});
	cap.bindTo('center', marker, 'position');
	flat = (Math.floor(mapCenter.lat() * 1000) / 1000);
	flng = (Math.floor(mapCenter.lng() * 1000) / 1000);

	titlebar.setTitle(flat + ' x ' + flng);
}

function delay(func) {
	lastEvent = new Date();
	setTimeout(func, 500);
}

function placeMarker(location) {
	marker = new google.maps.Marker({
		// position : location,
		map : gmap
	});
}

function createFirstPage() {

	firstPage = Ext.create('Ext.Container', {
		title : 'SteriaQuiz',
		items : [ {
			xtype : 'button',
			handler : function(button, event) {
				switchTo(mapPage);
				Ext.Msg.alert(mapQnum, mapQQ, Ext.emptyFn);
			},
			centered : true,
			height : 250,
			html : '<img src="sterialogo.gif" />',
			width : 250,
			iconAlign : 'center',
			text : ''
		} ]
	});
	Ext.Viewport.add(titlebar);

	return firstPage;

}

function createRegPage() {

	var nameField = Ext.create('Ext.field.Text', {
		id : 'name',
		label : 'Navn'
	});
	var emailField = Ext.create('Ext.field.Email', {
		id : 'email',
		label : 'Epost'
	});
	var phoneField = Ext.create('Ext.field.Number', {
		id : 'number',
		label : 'Telefon'
	});
	return Ext.create('Ext.Container', {
		title : 'SteriaQuiz',
		items : [ {
			xtype : 'fieldset',
			instructions : 'Registrer deg for &#xE5; bli med i trekningen!<br/>Personinformasjon lagres hos Steria fram til trekningen.',
			layout : {
				align : 'stretchmax',
				type : 'vbox'
			},
			items : [ nameField, emailField, phoneField, {
				xtype : 'button',
				handler : function(button, event) {
					nameField.setValue('');
					emailField.setValue('');
					phoneField.setValue('');
				},
				itemId : 'fjern',
				text : 'Fjern',
			}, {
				xtype : 'button',
				itemId : 'registrer',
				text : 'Registrer',
				handler : function(button, event) {
					var path = createRegPath(nameField.getValue(), emailField.getValue(), phoneField.getValue(), getCorrectAnswers());
					var xmlhttp = new XMLHttpRequest();
					xmlhttp.open("GET", path, true);
					xmlhttp.send(null);
					xmlhttp.onreadystatechange = function() {
						Ext.Msg.alert('Registreringsserveren forteller:', xmlhttp.responseText, Ext.emptyFn);
						// Hvis feilmelding, la
						// personen registrere
						// p√• nytt.
						if (xmlhttp.responseText.indexOf("Obs", 0) == -1) {
							button.setDisabled(true);
							// G√• til
							// avslutningsskjerm?

						} else {
							button.setDisabled(false);
						}

					};
				}
			} ]
		}, {
			xtype : 'panel',
			defaults : {
				xtype : 'button',
				style : 'margin: 0.1em',
				flex : 1,
			},
			layout : {
				pack : 'end',
				type : 'hbox',
			}
		} ]
	});
}

function createRegPath(name, email, phone, score) {
	var retval = regPath;
	retval += 'name=' + name;
	retval += '&email=' + email;
	retval += '&phone=' + phone;
	retval += '&score=' + score;
	return retval;
}

/** TODO */
function getCorrectAnswers() {
	var tmp, retval = 0, num;
	for ( var i = 0; i < allOrdinaryRadioButtonCorrectAnswers.length; i++) {
		num = allOrdinaryRadioButtonCorrectAnswers[i] - 1; // Because question
		// number begins at
		// 1, cboxes at 0.
		// selects the radio button that is supposed to be checked
		tmp = Ext.getCmp('cbox' + num);
		// and controls it.
		if (tmp.getChecked()) {
			retval++;
		}
	}
	// TODO support more map questions!
	console.log('Sjekker kart: CORR_lat: ' + CORR_lat + 'CORR_lng: ' + CORR_lng + ' Gitte verdier: ' + flat + ' ' + flng);
	var lat_d = CORR_lat - flat;
	var lng_d = CORR_lng - flng;
	console.log('Diffs er ' + lat_d + ' og ' + lng_d);
	if ((lat_d <= THRESH) && (lng_d <= THRESH)) {
		// Increase correct by diff to thresh.
		console.log('Poeng! ' + retval);
		retval += Math.floor(3 - (lat_d + lng_d)/2);
		console.log('Mer! ' + retval);
	}
	return retval;
}

function createCarousel() {

	carousel = Ext.create('Ext.carousel.Carousel', {
		title : 'SteriaQuiz',
	});
	return carousel;

}

/**
 * This function takes a variable number of arguments, using arguments[n] for
 * access.
 * 
 * Format is: Question, CorrectAnswer#, Answer1, Answer2, ..., Answer N. Returns
 * a questionPanel to put into the carousel.
 */
function addOrdinaryQuestionToCarousel() {

	// Register the correct question: globQuestCnt is used to get the correct
	// question offset.
	allOrdinaryRadioButtonCorrectAnswers[globAnsCnt] = (parseInt(arguments[1]) + globQuestCnt);
	// An array of radio buttons
	var ansRadioArray = new Array();
	for ( var i = 0; i < arguments[2].length; i++) {
		ansRadioArray[i] = {
			xtype : 'radiofield',
			name : 'answer',
			id : 'cbox' + (globQuestCnt),
			value : arguments[2][i],
			label : arguments[2][i],
			check : false,
			labelWidth : '90 %'
		};
		globQuestCnt++;
	}
	
	var instr = '<center>Dra i siden for &#xE5; komme videre!<br /><font size=12>';
	if (globAnsCnt == numOrdQuestions - 1)
		instr += '&#8592;</font></center>';
	else if (globAnsCnt == 0)
		instr += '&#8594;</font></center>';
	else
		instr += '&#8592;&nbsp;&nbsp;&nbsp;&nbsp;&#8594;</font></center>';

	var questionPanel = Ext.create('Ext.form.Panel', {
		items : [ {
			xtype : 'fieldset',
			title : arguments[0],
			items : ansRadioArray,
			instructions : instr
		} ]
	});
	globAnsCnt++;
	return questionPanel;
}

function createQuestionsCarousel(quizPath) {

	if (quizPath) {
		var xmlhttp = new XMLHttpRequest();
		var xmlDocument;
		// Array of all questions:
		var allQuestions;
		// Array of all answers:
		var allAnswers;
		// the correct answer
		var correctNum;
		var carouselPanels = new Array();
		xmlhttp.open("GET", quizPath, true);
		xmlhttp.send(null);
		var q = 0;
		numOrdQuestions = 0;
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				// Read contents
				xmlDocument = xmlhttp.responseText;
				var parser = new DOMParser();
				var doc = parser.parseFromString(xmlDocument, 'text/xml');
				allQuestions = doc.documentElement.getElementsByTagName('question');

				for ( var i = 0; i < allQuestions.length; i++) {
					if (allQuestions[i].getElementsByTagName('type').item(0).textContent == "ordinary") {
						numOrdQuestions++;
					}
				}
				for ( var i = 0; i < allQuestions.length; i++) {
					if (allQuestions[i].getElementsByTagName('type').item(0).textContent == "ordinary") {
						var title = allQuestions[i].getElementsByTagName('title').item(0).textContent;
						allAnswers = allQuestions[i].getElementsByTagName('answer');
						var tmpWrong = new Array();
						// Make wrong answers into a string array
						for ( var j = 0; j < allAnswers.length; j++) {
							tmpWrong[j] = allAnswers[j].textContent;
						}
						correctNum = allQuestions[i].getElementsByTagName('correct')[0].textContent;
						var pan = addOrdinaryQuestionToCarousel(title, correctNum, tmpWrong);
						carouselPanels[q] = pan;
						allOrdinaryRadioButtonQuestions[q] = title;
						q++;

						// Last ordinary question.
						if (i == numOrdQuestions - 1) {
							var answerButton = Ext.create('Ext.Button', {
								text : 'Trykk for &#xE5 levere!',
								listeners : {
									tap : function() {
										var cnt = 0;
										for ( var i = 0; i < globQuestCnt; i++) {
											tmp = Ext.getCmp('cbox' + i);
											if (tmp.getChecked())
												cnt++;
										}
										if (cnt == allOrdinaryRadioButtonCorrectAnswers.length)
											switchTo(regPage);
										else {
											Ext.Msg.alert('Obs!', 'Du m&#xE5 svare p&#xE5 alle sp&#xF8rsm&#xE5l', Ext.emptyFn);
										}
									}
								}
							});
							pan.add(answerButton);
						}
						carousel.add(pan);
					} else if (allQuestions[i].getElementsByTagName('type').item(0).textContent == "map") {
						var title = allQuestions[i].getElementsByTagName('title').item(0).textContent;
						mapQnum += i;
						mapQQ = title;
						THRESH = allQuestions[i].getElementsByTagName('threshold')[0].textContent;
						CORR_lat = allQuestions[i].getElementsByTagName('correct')[0].getElementsByTagName('lat')[0].textContent;
						CORR_lng = allQuestions[i].getElementsByTagName('correct')[0].getElementsByTagName('lng')[0].textContent;
						
					}
				}
			}
		};
	}
}
