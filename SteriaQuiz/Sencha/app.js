var titleBar;
var currentPage;
var firstPage;
var menuBtn;
var carousel;
var regPage;
var allQuestions;

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

	return Ext.create('Ext.Container', {
		title : 'SteriaQuiz',
		items : [ {
			xtype : 'fieldset',
			instructions : 'Registrer deg for å bli med i trekningen!',
			layout : {
				align : 'stretchmax',
				type : 'vbox'
			},
			items : [ {
				xtype : 'textfield',
				id : 'navn',
				label : 'Navn'
			}, {
				xtype : 'emailfield',
				id : 'epost',
				label : 'Epost'
			}, {
				xtype : 'numberfield',
				id : 'telefon',
				label : 'Telefon'
			}, {
				xtype : 'button',
				handler : function(button, event) {
					switchTo(firstPage);
				},
				itemId : 'fjern',
				text : 'Fjern'
			}, {
				xtype : 'button',
				itemId : 'mybutton2',
				text : 88
			}, {
				xtype : 'button',
				itemId : 'registrer',
				text : 'Registrer'
			} ]
		}, {
			xtype : 'panel',
			defaults : {
				xtype : 'button',
				style : 'margin: 0.1em',
				flex : 1
			},
			layout : {
				pack : 'end',
				type : 'hbox'
			}
		} ]
	});
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
// console.log(arguments);
	// An array of radio buttons
	var ansRadioArray = new Array();
	var tmpCnt = 0;
	for (var i = 0; i < arguments[2].length; i++) {
		ansRadioArray[i] = {
            xtype: 'radiofield',
            name : 'color',
            value: arguments[2][i],
            label: arguments[2][i],
            checked: true
        };
	}
	var questionPanel = Ext.create('Ext.form.Panel', {
	    items: [{
	    	xtype: 'fieldset',
			title: arguments[0],
	    	items: ansRadioArray
	    }]
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
				// Read contents
				xmlDocument = xmlhttp.responseText;
				var parser = new DOMParser();
				var doc = parser.parseFromString(xmlDocument, 'text/xml');
				allQuestions = doc.documentElement
						.getElementsByTagName('question');
				for ( var i = 0; i < allQuestions.length; i++) {
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
					alert(i);
					if (i == allQuestions.length - 1) {
						alert('hallo');
						var answerButton = Ext.create('Ext.Button', {
							text : 'Bra jobba!',
							listeners : {
								tap : function() {
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
