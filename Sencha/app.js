var titleBar;
var currentPage;
var firstPage;
var menuBtn;
var carousel;
var regPage;
var allQuestions;

var regPath = '../reg.php?';
var scoreboardPath = '../scoreboard.xml';
var scoreboard = '';
var globQuestCnt = 0;

var emptyQuestion = Ext.create('Ext.Container', {
	title : 'EmptyQuestion'
});

Ext.application({
	name : 'SteriaQuiz',

	launch : function() {
		firstPage = createFirstPage();
		regPage = createRegPage();
		carousel = createCarousel();
		createQuestionsCarousel('../Quiz/JavaZone2012.quiz');
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

function createFirstPage() {

	firstPage = Ext.create('Ext.Container', {
		title : 'SteriaQuiz',
		items : [ {
			xtype : 'button',
			handler : function(button, event) {
				loadScoreboard();
				switchTo(carousel);
			},
			centered : true,
			height : 250,
			html : '<img src="sterialogo.gif" />',
			width : 250,
			iconAlign : 'center',
			text : ''
		} ]
	});
	Ext.Viewport.add({
		xtype : 'titlebar',
		docked : 'top',
		title : 'SteriaQuiz',
		items : [ {
			iconCls : 'home',
			iconMask : true,
			align : 'right',
			listeners : {
				tap : function() {
					console.log('tries switching to ' + firstPage);
					switchTo(firstPage);
				}
			}
		} ],
	});

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
	return Ext
			.create(
					'Ext.Container',
					{
						title : 'SteriaQuiz',
						items : [
								{
									xtype : 'fieldset',
									instructions : 'Registrer deg for &#xE5; bli med i trekningen!<br/>Personinformasjon lagres hos Steria fram til trekningen.',
									layout : {
										align : 'stretchmax',
										type : 'vbox'
									},
									items : [
											nameField,
											emailField,
											phoneField,
											{
												xtype : 'button',
												handler : function(button,
														event) {
													nameField.setValue('');
													emailField.setValue('');
													phoneField.setValue('');
												},
												itemId : 'fjern',
												text : 'Fjern',
											},
											{
												xtype : 'button',
												itemId : 'registrer',
												text : 'Registrer',
												handler : function(button,
														event) {
													var path = createRegPath(
															nameField
																	.getValue(),
															emailField
																	.getValue(),
															phoneField
																	.getValue(),
															getCorrectAnswers());
													var xmlhttp = new XMLHttpRequest();
													if (!path) {
														button
																.setDisabled(true);
														button.setValue('Allerede registrert!');
														return;
													}
													;
													xmlhttp.open("GET", path,
															true);
													xmlhttp.send(null);
													xmlhttp.onreadystatechange = function() {
														Ext.Msg.alert('Suksess!',xmlhttp.responseText, Ext.emptyFn);
														if (xmlhttp.responseText.indexOf("registrert!",0)) button.setDisabled(true);
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
	if (existsAlready(name, email, phone)) {
		Ext.Msg.alert('Ai ai ai!',
				"Det ser ut som om du allerede har v&#xE6; rt med i konkurransen! ",
				Ext.emptyFn);
		return 0;
	}
	retval += 'name=' + name;
	retval += '&email=' + email;
	retval += '&phone=' + phone;
	retval += '&score=' + score;
	return retval;
}

/**
 * Compares the information against what's stored on the scoreboard.
 */
function existsAlready() {

	var retval = false;
	answered = true;
	for (var i = 0; i < arguments.length; i++) {
		if (scoreboard.indexOf(arguments[i], 0) != -1) {
			retval = true;
		}	
	}
	return retval;
}
/** TODO */
function getCorrectAnswers() {
	return Math.floor(Math.random() * 400);
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
function addQuestionToCarousel() {
	// console.log(arguments);// console.log(arguments);
	// An array of radio buttons
	var ansRadioArray = new Array();
	for ( var i = 0; i < arguments[2].length; i++) {
		ansRadioArray[i] = {
			xtype : 'radiofield',
			name : 'color',
			value : arguments[2][i],
			label : arguments[2][i],
			checked : true
		};
	}
	var questionPanel = Ext.create('Ext.form.Panel', {
		items : [ {
			xtype : 'fieldset',
			title : arguments[0],
			items : ansRadioArray
		} ]
	});
	return questionPanel;
}

function createQuestionsCarousel(quizPath) {

	if (quizPath) {
		var xmlhttp = new XMLHttpRequest();
		var xmlDocument;
		// Array of all questions:
		var allQuestions;
		// Array of all answers:
		var allWrongAnswers;
		// the correct answer
		var correctNum;
		var carouselPanels = new Array();
		xmlhttp.open("GET", quizPath, true);
		xmlhttp.send(null);
		var q = 0;
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				console.log('bar');
				// Read contents
				xmlDocument = xmlhttp.responseText;
				var parser = new DOMParser();
				var doc = parser.parseFromString(xmlDocument, 'text/xml');
				allQuestions = doc.documentElement
						.getElementsByTagName('question');
				for ( var i = 0; i < allQuestions.length; i++) {
					console.log('baz');
					var title = allQuestions[i].getElementsByTagName('title')
							.item(0).textContent;
					allWrongAnswers = allQuestions[i]
							.getElementsByTagName('answer');
					var tmpWrong = new Array();
					// Make wrong answers into a string array
					for ( var j = 0; j < allWrongAnswers.length; j++) {
						tmpWrong[j] = allWrongAnswers[j].textContent;
					}
					correctNum = allQuestions[i]
							.getElementsByTagName('correct')[0].textContent;
					var pan = addQuestionToCarousel(title, correctNum, tmpWrong);
					carouselPanels[q++] = pan;

					if (i == allQuestions.length - 1) {
						var answerButton = Ext.create('Ext.Button', {
							text : 'Bra jobba!',
							listeners : {
								tap : function() {
									console.log(scoreboard);
									switchTo(regPage);
								}
							}
						});
						pan.add(answerButton);
					}
					carousel.add(pan);
				}
			}
		};
	}
}

function loadScoreboard () {
	console.log('Loading scoreboard!');
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", scoreboardPath, true);
	xmlhttp.send(null);
	xmlhttp.onreadystatechange = function() {
		console.log("state: " + xmlhttp.readyState);
		if (xmlhttp.readyState == 4) {
			scoreboard = xmlhttp.responseText;
			console.log(scoreboard);
		}
	};
}