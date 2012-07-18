
var titlebar;
var currentPage;
var firstPage;
var menuBtn;
var carousel;
var regPage;
var globalPlagsomTeller = 0;
/**
 * Konstrukt�r for kartsider
 * 
 */
function Map() {

	var thisMap = this;
	var questionID;

	this.handleMovement = function() {
		if (!this.lastEvent)
			return;
		if (this.lastEvent.getTime() + 500 > new Date().getTime())
			return;
		var _map = this.gmap.getMap();
		if (this.marker) {
			this.marker.setMap(null); 
		}
		this.marker = new google.maps.Marker({
			position : this.mapCenter,
			title : this.mapCenter.toString(),
			map : _map,
			listeners : {
				click : function(me) {
					var locationBubble = new google.maps.InfoWindow();
					locationBubble.setContent(_map.getCenter().toString);
					locationBubble.open(this.gmap, this.marker);
				}
			}
		});
		if (this.cap) {
			this.cap.setMap(null);
		}
		// Add circle overlay and bind to this.marker
		this.cap = new google.maps.Circle({
			map : _map,
			radius : 500,
			clickable : false,
			fillOpacity : 0.2,
			strokeWeight : 1,
			strokeColor : '#DD0000',
			fillColor : '#AA0000'
		});
		this.cap.bindTo('center', this.marker, 'position');
		this.flat = (Math.floor(this.mapCenter.lat() * 1000) / 1000);
		this.flng = (Math.floor(this.mapCenter.lng() * 1000) / 1000);
	};

	this.createMapPage = function(question) {
		var pos = new google.maps.LatLng(65.83878, 13.88672);
		var x = (document.height - 75);
		this.gmap = Ext.create('Ext.Map', {
			xtype : 'map',
			useCurrentLocation : false,
			height : x, // TODO!!!
			mapOptions : {
				center : pos,
				zoom : 4
			},
			listeners : {
				centerchange : function(comp, map) {
					thisMap.mapCenter = map.getCenter();
					thisMap.delay(thisMap.handleMovement());
				},
				maprender : function(comp, map) {
					setTimeout(function() {
						map.panTo(pos);
					}, 1000);
				},

			}
		});
		this.mapPage = new Ext.Panel({
			iconCls : 'map',
			title : 'Map',
			ui : 'light',
			items : [ {
				xtype : 'container',
				items : this.gmap
			}, {
				xtype : 'button',
				text : 'Forn�yd',
				id : 'happy',
				docked : 'bottom',
				listeners : {
					tap : function(button, event) {
						answers[0] = mapQ.mapCenter;
						carousel.setActiveItem(3);
						Ext.Msg.alert('Oppgave 2', sliderQ.QQ, Ext.emptyFn);
					}
				}
			} ]
		});
	}

	this.delay = function(func) {
		this.lastEvent = new Date();
		setTimeout(func, 500);
	}

	this.placeMarker = function(location) {
		this.marker = new google.maps.Marker({
			// position : location,
			map : this.gmap
		});
	}

	this.createMapPage();
};

/**
 * Konstrukt�r til slider-klassen. Forel�pig satt til 'hus'
 */
function Slider() {

	var questionID;
	this.value = 0;
	this.MAX = 170;

	this.createSlider = function() {

		this.okBtn = new Ext.Button({
			docked : 'bottom',
			text : 'foo',
			id : 'house_ok',
			listeners : {
				tap : function() {
					carousel.setActiveItem(1);
					Ext.Msg.alert('Oppgave 3', imgQ.QQ, Ext.emptyFn);
				}
			}

		});
		this.house = new Ext.Container({
			alignment : 'stretch',
			id : 'house_img',
			html : '<img src="steria-bg.png" click: />',
			scrollable : {
				direction : 'vertical'
			},
			items : this.okBtn
		});
	}

	this.createSlider();
}

function ImageSelector() {

	var questionID;
	this.src = new Array();
	this.img0 = new Ext.Button({
		html : '',
		listeners : {
			tap : function() {
				answers[2] = 1;
				carousel.setActiveItem(2);
			}
		},
		flex : 1
	});
	this.img1 = new Ext.Button({
		html : '',
		listeners : {
			tap : function() {
				answers[2] = 2;
				carousel.setActiveItem(2);
			}
		},
		flex : 2
	});
	this.img2 = new Ext.Button({
		html : '',
		listeners : {
			tap : function() {
				answers[2] = 3;
				carousel.setActiveItem(2);
			}
		},
		flex : 1
	});
	this.img3 = new Ext.Button({
		html : '',
		flex : 2,
		listeners : {
			tap : function() {
				answers[2] = 4;
				carousel.setActiveItem(2);
			}
		},
		flex : 2
	});

	this.createImageSelector = function() {
	
		/** TODO forminske dette: */
		var panTop = new Ext.Panel({
			layout : 'hbox',
			items : [ this.img0, this.img1 ]
		});
		var panBtm = new Ext.Panel({
			layout : 'hbox',
			flex : 2,
			items : [ this.img2, this.img3 ]
		});
		this.panel = new Ext.Panel({
			
			layout : 'vbox',
			items : [ panTop, panBtm]
		})

	}

	/** Get a reasonable picture size.. */
	this.getSize = function() {

		if (document.width < document.height) {
			return document.width / 3.5;
		}
		return document.height / 3.5;
	}

	this.createImageSelector();
}

// TODO set til arrays av hver type!
var sliderQ;

var mapQ;

var imgQ;

var allOrdinaryRadioButtonQuestions = new Array();
/* Correct answers to all ordinary radio button questions */
var allOrdinaryRadioButtonCorrectAnswers = new Array();

// Array of all answers:
var allAnswers;

var answers = new Array();

var regPath = '../reg.php?';
var globAnsCnt = 2;
var globQuestCnt = 0;
var totQuestions = 0;
var quizInfo;

Ext.application({
	name : 'SteriaQuiz',

	launch : function() {

		initStep1();
	}
});

this.getMousePosition = function(e) {
	
	if (carousel.getActiveIndex() != sliderQ.questionID) return;
	var scroll = sliderQ.house.getScrollable().getScroller().setFps(10).position.y;
	var y = e.pageY + scroll;
	y -= sliderQ.MAX;
	if (y > 1512)
		return;
	y /= 22;
	y = Math.ceil(y);
	y = 61 - y;
	sliderQ.okBtn.setText('Gjett ' + y + ' etasjer.');
	sliderQ.value = y;
	answers[1] = y;
	
	return true;
}

function initStep1() {
	titlebar = createTitlebar();
	regPage = createRegPage();
	carousel = createCarousel();
	mapQ = new Map();
	sliderQ = new Slider();
	imgQ = new ImageSelector();
	// Asynchronous; relies on XMLHttpRequest. Next functions must wait a short
	// while to be executed. Therefore continued in step2.
	getQuestions('../Quiz/JavaZone2012.quiz');
}

/**
 * Called by getQuestions()....
 */
function initStep2() {
	firstPage = createFirstPage();
	switchTo(firstPage);
}

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

function createFirstPage() {

	firstPage = Ext.create('Ext.Container', {
		title : 'SteriaQuiz',
		id : 'startSide',
		layout : {
				type : 'vbox',
				align : 'center'
				
		},
		items : [ {
			xtype : 'button',
			id : 'startknapp',
			handler : function(button, event) {
				switchTo(carousel);
			},
			
			height : 250,
			html : '<img src="sterialogo.gif" />',
			width : 250,
			iconAlign : 'center',
			text : ''
		}, {

			xtype : 'label',
			id : 'startknapp3',
			//centered : true,
			height : 10,
			width : 250,
			iconAlign : 'center',
			id : 'instruction',
			html : quizInfo
		}]
		
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
					var path = createRegPath(nameField.getValue(), emailField.getValue(), phoneField.getValue());
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

function createRegPath(name, email, phone, ans) {
	var retval = regPath;
	retval += 'name=' + name;
	retval += '&email=' + email;
	retval += '&phone=' + phone;
	var ans = '';

	for ( var i = 0; i < answers.length; i++) {
		if (answers[i])
			ans += answers[i] + ';';
	}
	retval += '&answers=' + ans;
	console.log('http://localhost/' + retval);
	return retval;
}


function createCarousel() {

	carousel = Ext.create('Ext.carousel.Carousel', {
		title : 'SteriaQuiz',
		listeners : {
			activeitemchange : function(thisContainer, value, oldValue, eOpts) {
				if (value.getId() == 'house_img') {
					document.onclick = getMousePosition;
				}
			}
		}
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
function prepareOrdinaryQuestionForCarousel() {

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
			label : arguments[2][i],
			check : false,
			labelWidth : '90 %',
			listeners : {
				check : function(thisBox, e, eOpts) {
					answers[3+(globalPlagsomTeller++)] = thisBox.getId();
				}
			}
		};
		globQuestCnt++;
	}

	var instr = '<center>Dra i siden for &#xE5; komme videre!<br /><font size=12>';
	if (globAnsCnt == totQuestions-1)
		instr += '<a href="#" onClick="carousel.setActiveItem(carousel.getActiveIndex()-1);" style="text-decoration: none">&#8592;</a></font></center>';
	else
		instr += '<a href="#" onClick="carousel.setActiveItem(carousel.getActiveIndex()-1);" style="text-decoration: none">&#8592;</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onClick="carousel.setActiveItem(carousel.getActiveIndex()+1);" style="text-decoration: none">&#8594;</a></font></center>';

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

function hallo () {
	
}

function getQuestions(quizPath) {

	if (quizPath) {
		var xmlhttp = new XMLHttpRequest();
		var xmlDocument;
		// Array of all questions:
		var allQuestions;
		// the correct answer
		var correctNum;
		xmlhttp.open('GET', quizPath, true);
		xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
		xmlhttp.send(null);
		var q = 0;
		totQuestions = 0;
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				// Read contents
				xmlDocument = xmlhttp.responseText;
				var parser = new DOMParser();
				var doc = parser.parseFromString(xmlDocument, 'text/xml');
				allQuestions = doc.documentElement.getElementsByTagName('question');
				quizInfo = doc.documentElement.getElementsByTagName('info').item(0).textContent;

//				totQuestions = allQuestions[i].getElementsByTagName('type').length;
				totQuestions = allQuestions.length;
				var questionID = 0;
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
						var pan = prepareOrdinaryQuestionForCarousel(title, correctNum, tmpWrong);
						allOrdinaryRadioButtonQuestions[q] = title;
						q++;

						// Last ordinary question. %TODO 
						if (i == totQuestions - 1) {
							var answerButton = Ext.create('Ext.Button', {
								text : 'Trykk for &#xE5 levere!',
								id : 'lever',
								listeners : {
									tap : function() {

										var answered = 0;
										for ( var j = 0; j < answers.length; j++) {
											if (answers[j])
												answered++;
										}
										console.log(answered);
										console.log(questionID);
										if (answered == questionID)
											switchTo(regPage);
										else
											Ext.Msg.alert('Obs!', 'Du m&#xE5; svare p&#xE5; alle sp&#xF8;rsm&#xE5;l', Ext.emptyFn);
											
									}
								}
							});
							pan.add(answerButton);
						}
						
						carousel.add(pan);
					} else if (allQuestions[i].getElementsByTagName('type').item(0).textContent == 'map') {
						var title = allQuestions[i].getElementsByTagName('title').item(0).textContent;
						mapQ.mapQQ = title;
						mapQ.THRESH = allQuestions[i].getElementsByTagName('threshold')[0].textContent;
						mapQ.CORR_lat = allQuestions[i].getElementsByTagName('correct')[0].getElementsByTagName('lat')[0].textContent;
						mapQ.CORR_lng = allQuestions[i].getElementsByTagName('correct')[0].getElementsByTagName('lng')[0].textContent;
						carousel.add(mapQ.gmap);
						mapQ.questionID = questionID;
					} else if (allQuestions[i].getElementsByTagName('type').item(0).textContent == 'slider') {
						sliderQ.QQ = allQuestions[i].getElementsByTagName('title').item(0).textContent;
						sliderQ.CORR = allQuestions[i].getElementsByTagName('correct').item(0).textContent;
						carousel.add(sliderQ.house);
						var num = 0;
						for (var j = 0;; j++) {
							if (!carousel.getAt(j)) break;
						}
						console.log('vi har ' + num + ' elementer');
						sliderQ.questionID = questionID;
					} else if (allQuestions[i].getElementsByTagName('type').item(0).textContent == 'imgsel') {
						imgQ.QQ = allQuestions[i].getElementsByTagName('title').item(0).textContent;
						imgQ.CORR = allQuestions[i].getElementsByTagName('correct').item(0).textContent;
						var items = allQuestions[i].getElementsByTagName('img_src');
						for ( var j = 0; j < items.length; j++) {
							imgQ.src[j] = items[j].textContent;
						}
		
						imgQ.img0.setHtml('<img id="land" src="' + imgQ.src[0] + '" height="' + imgQ.getSize() + '"  width="' + imgQ.getSize() + '" />');
						imgQ.img1.setHtml('<img id="land" src="' + imgQ.src[1] + '" height="' + imgQ.getSize() + '"  width="' + imgQ.getSize() + '" />');
						imgQ.img2.setHtml('<img id="land" src="' + imgQ.src[2] + '" height="' + imgQ.getSize() + '"  width="' + imgQ.getSize() + '" />');
						imgQ.img3.setHtml('<img id="land" src="' + imgQ.src[3] + '" height="' + imgQ.getSize() + '"  width="' + imgQ.getSize() + '" />');
						items = allQuestions[i].getElementsByTagName('img_txt');
						for ( var j = 0; j < items.length; j++) {
							imgQ.txt[j] = items[j].textContent;
						}
						imgQ.questionID = questionID;
						carousel.add(imgQ.panel);
					}
					questionID++;
				}

				initStep2();
			}
		};

	}
}

