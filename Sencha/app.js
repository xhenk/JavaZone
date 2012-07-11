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
var mapQQ;

/**
 * All slider-related variables (House)
 */
var house_house;
var house_value = 0;
var house_okBtn;
var house_MAX = 170;
var house_CORR;
var house_QQ;

/**
 * All image-selector variables
 */
var img_panel;
var img_QQ;
var img_CORR;
var img_src = new Array();
var img_txt = new Array();

var allOrdinaryRadioButtonQuestions = new Array();
/* Correct answers to all ordinary radio button questions */
var allOrdinaryRadioButtonCorrectAnswers = new Array();
var answers = new Array();

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
		getQuestions('../Quiz/JavaZone2012.quiz');
		mapPage = createMapPage();
		house_house = createSlider();
		img_panel = createImageSelector();
		// addQuestionToCarousel('Question 1', 'Answer 1', 'Answer 2', 'Answer
		// 3', 'Answer 4', 0);
		document.onclick = getMousePosition;
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
			id : 'hjem',
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
		height : x, // TODO!!!
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
			text : 'Forn�yd',
			id : 'happy',
			docked : 'bottom',
			listeners : {
				tap : function(button, event) {
					answers.push(mapCenter);
					Ext.Msg.alert('Oppgave 2', house_QQ, Ext.emptyFn);
					switchTo(house_house);
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
		radius : 500,
		clickable : false,
		fillOpacity : 0.2,
		strokeWeight : 1,
		strokeColor : '#DD0000',
		fillColor : '#AA0000'
	});
	cap.bindTo('center', marker, 'position');
	flat = (Math.floor(mapCenter.lat() * 1000) / 1000);
	flng = (Math.floor(mapCenter.lng() * 1000) / 1000);
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
			id : 'startknapp',
			handler : function(button, event) {
				switchTo(mapPage);
				Ext.Msg.alert('Kartoppgave', mapQQ, Ext.emptyFn);
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

function getMousePosition(e) {
	if (currentPage != house_house)
		return;
	console.log('clicked ' + (currentPage == house_house));
	var scroll = house_house.getScrollable().getScroller().setFps(10).position.y;
	var y = e.pageY + scroll;
	y -= house_MAX;
	if (y > 1512)
		return;
	y /= 22;
	y = Math.ceil(y);
	y = 61 - y;
	house_okBtn.setText('Gjett ' + y + ' etasjer.');
	house_value = y;
	return true;
}
function createImageSelector () {
	
	var btn1 = new Ext.Button({
		docked : 'bottom',
		text : 'foo',
		listeners : {
			tap : function() {
				answers.push(house_value);
				switchTo(carousel);
			}
		}
	});
	
	img_panel = new Ext.Panel({
		alignment : 'stretch',
	});
	return house_house;
}

function createSlider() {

	house_okBtn = new Ext.Button({
		docked : 'bottom',
		text : 'foo',
		listeners : {
			tap : function() {

				answers.push(house_value);
				switchTo(carousel);
			}
		}

	});
	house_house = new Ext.Container({
		alignment : 'stretch',
		html : '<img src="steria-bg.png" click: />',
		scrollable : {
			direction : 'vertical'
		},
		items : house_okBtn
	});
	return house_house;
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
				id : 'fjern',
				handler : function(button, event) {
					nameField.setValue('');
					emailField.setValue('');
					phoneField.setValue('');
				},
				itemId : 'fjern',
				text : 'Fjern',
			}, {
				xtype : 'button',
				id : 'registrer',
				itemId : 'registrer',
				text : 'Registrer',
				handler : function(button, event) {
					var path = createRegPath(nameField.getValue(), emailField.getValue(), phoneField.getValue(), getCorrectAnswers());
					var xmlhttp = new XMLHttpRequest();
					xmlhttp.open('GET', path, true);
					xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
					xmlhttp.send(null);
					xmlhttp.onreadystatechange = function() {
						Ext.Msg.alert('Registreringsserveren forteller:', xmlhttp.responseText, Ext.emptyFn);
						// Hvis feilmelding, la
						// personen registrere
						// på nytt.
						if (xmlhttp.responseText.indexOf('Obs', 0) == -1) {
							button.setDisabled(true);
							// Gå til
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

function createRegPath(name, email, phone, score, ans) {
	var retval = regPath;
	retval += 'name=' + name;
	retval += '&email=' + email;
	retval += '&phone=' + phone;
	retval += '&score=' + score;
	var ans = '';
	console.log('Answers: ' + answers.length);
	for ( var i = 0; i < answers.length; i++) {
		ans += answers[i] + ';';
	}
	retval += '&answers=' + ans;
	console.log('Reg Path: ' + retval);
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
	var lat_d = Math.abs(CORR_lat - flat);
	var lng_d = Math.abs(CORR_lng - flng);
	var snitt = (lat_d + lng_d) / 2;
	if (snitt <= THRESH)
		retval += 3;
	else if (snitt <= 3 * THRESH)
		retval += 2;
	else if (snitt <= 10 * THRESH)
		retval += 1;
	console.log('House: ' + house_value + ' ' + house_CORR);
	console.log('House: ' + retval);
	switch (Math.abs(house_value - house_CORR)) {
	case 0:
		retval += 3;
		break;
	case 1:
		retval += 2;
		break;
	case 2:
		retval += 1;
		break;
	case 3:
		retval += 1;
		break;
	}
	console.log('House: ' + retval);

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

function getQuestions(quizPath) {

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
		xmlhttp.open('GET', quizPath, true);
		xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
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
					if (allQuestions[i].getElementsByTagName('type').item(0).textContent == 'ordinary') {
						numOrdQuestions++;
					}
				}
				for ( var i = 0; i < allQuestions.length; i++) {
					if (allQuestions[i].getElementsByTagName('type').item(0).textContent == 'ordinary') {
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
								id : 'lever',
								listeners : {
									tap : function() {
										var cnt = 0;
										for ( var i = 0; i < globQuestCnt; i++) {
											tmp = Ext.getCmp('cbox' + i);
											if (tmp.getChecked()) {
												cnt++;
												answers.push(i);
												console.log('Found checked box:' + i);
											}
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
					} else if (allQuestions[i].getElementsByTagName('type').item(0).textContent == 'map') {
						var title = allQuestions[i].getElementsByTagName('title').item(0).textContent;
						mapQQ = title;
						THRESH = allQuestions[i].getElementsByTagName('threshold')[0].textContent;
						CORR_lat = allQuestions[i].getElementsByTagName('correct')[0].getElementsByTagName('lat')[0].textContent;
						CORR_lng = allQuestions[i].getElementsByTagName('correct')[0].getElementsByTagName('lng')[0].textContent;

					} else if (allQuestions[i].getElementsByTagName('type').item(0).textContent == 'slider') {
						house_QQ = allQuestions[i].getElementsByTagName('title').item(0).textContent;
						house_CORR = allQuestions[i].getElementsByTagName('correct').item(0).textContent;
					} else if (allQuestions[i].getElementsByTagName('type').item(0).textContent == 'imgsel') {
						img_QQ = allQuestions[i].getElementsByTagName('title').item(0).textContent;
						house_CORR = allQuestions[i].getElementsByTagName('correct').item(0).textContent;
						var items = allQuestions[i].getElementsByTagName('img_src');
						for (var j = 0; j < items.length; j++) {
							img_src[j] = items.item(j).textContent;
						}
						items = allQuestions[i].getElementsByTagName('img_txt');
						for (var j = 0; j < items.length; j++) {
							img_txt[j] = items.item(j).textContent;
						}
					}
				}
			}
		};
	}
}
