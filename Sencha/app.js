var titleBar;
var currentPage;
var firstPage;
var menuBtn;
var carousel;
var regPage;
var allOrdinaryRadioButtonQuestions = new Array();
/* Correct answers to all ordinary radio button questions */
var allOrdinaryRadioButtonCorrectAnswers = new Array();

var regPath = '../reg.php?';
var globAnsCnt = 0;
var globQuestCnt = 0;
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
													xmlhttp.open("GET", path,
															true);
													xmlhttp.send(null);
													xmlhttp.onreadystatechange = function() {
														Ext.Msg
																.alert(
																		'Registreringsserveren forteller:',
																		xmlhttp.responseText,
																		Ext.emptyFn);
														// Hvis feilmelding, la
														// personen registrere
														// på nytt.
														console.log('OBS? ' + xmlhttp.responseText
																.indexOf(
																		"Obs",
																		0));
														if (xmlhttp.responseText
																.indexOf(
																		"Obs",
																		0) == -1) {
															button
																	.setDisabled(true);
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
	console.log('===========Get' + allOrdinaryRadioButtonCorrectAnswers.length
			+ 'CorrectAnswers===========');
	for ( var i = 0; i < allOrdinaryRadioButtonCorrectAnswers.length; i++) {
		num = allOrdinaryRadioButtonCorrectAnswers[i] - 1; // Because question
		// number begins at
		// 1, cboxes at 0.
		console.log('Answer number  ' + num + ' is correct for question ' + i);
		// selects the radio button that is supposed to be checked
		tmp = Ext.getCmp('cbox' + num);
		// and controls it.
		if (tmp.getChecked()) {
			retval++;
		}
		console.log('cbox' + num + ' was ' + (tmp.getChecked() ? '' : 'un')
				+ 'checked');
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
	console.log('registers answer ' + arguments[1] + '(+' + globQuestCnt
			+ ') as correct in aORBCA[' + globAnsCnt + ']');
	allOrdinaryRadioButtonCorrectAnswers[globAnsCnt] = (parseInt(arguments[1]) + globQuestCnt);
	console.log('allOrdinaryRadioButtonCorrectAnswers[globAnsCnt] = '
			+ allOrdinaryRadioButtonCorrectAnswers[globAnsCnt]);
	// An array of radio buttons
	var ansRadioArray = new Array();
	for ( var i = 0; i < arguments[2].length; i++) {
		ansRadioArray[i] = {
			xtype : 'radiofield',
			name : 'answer',
			id : 'cbox' + (globQuestCnt),
			value : arguments[2][i],
			label : arguments[2][i],
			check : false
		};
		globQuestCnt++;
	}
	var questionPanel = Ext.create('Ext.form.Panel', {
		items : [ {
			xtype : 'fieldset',
			title : arguments[0],
			items : ansRadioArray
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
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				// Read contents
				xmlDocument = xmlhttp.responseText;
				var parser = new DOMParser();
				var doc = parser.parseFromString(xmlDocument, 'text/xml');
				allQuestions = doc.documentElement
						.getElementsByTagName('question');
				for ( var i = 0; i < allQuestions.length; i++) {
					var title = allQuestions[i].getElementsByTagName('title')
							.item(0).textContent;
					allAnswers = allQuestions[i].getElementsByTagName('answer');
					var tmpWrong = new Array();
					// Make wrong answers into a string array
					for ( var j = 0; j < allAnswers.length; j++) {
						tmpWrong[j] = allAnswers[j].textContent;
					}
					correctNum = allQuestions[i]
							.getElementsByTagName('correct')[0].textContent;
					var pan = addOrdinaryQuestionToCarousel(title, correctNum,
							tmpWrong);
					carouselPanels[q] = pan;
					allOrdinaryRadioButtonQuestions[q] = title;
					q++;

					if (i == allQuestions.length - 1) {
						var answerButton = Ext
								.create(
										'Ext.Button',
										{
											text : 'Bra jobba!',
											listeners : {
												tap : function() {
													var cnt = 0;
													for ( var i = 0; i < globQuestCnt; i++) {
														tmp = Ext.getCmp('cbox'
																+ i);
														if (tmp.getChecked())
															cnt++;
														console
																.log('cbox'
																		+ i
																		+ ' '
																		+ tmp
																				.getChecked());
													}
													if (cnt == allOrdinaryRadioButtonCorrectAnswers.length)
														switchTo(regPage);
													else {
														Ext.Msg
																.alert(
																		'Obs!',
																		'Du m&#xE5 svare p&#xE5 alle sp&#xF8rsm&#xE5l',
																		Ext.emptyFn);
													}
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
