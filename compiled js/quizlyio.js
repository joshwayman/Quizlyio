// Compiled with Babel https://babeljs.io
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *  Quizlyio
 *  Simple Javascript library for embedding interactive quizes.
 *  By @joshwayman for @compassionau
 *
 *  Currently works only for radio button questions.
 *  The name of the inputs needs to be q + the question number.
 */

var Quizlyio = function () {
    /*
        Create a new quiz requires three params
            -   Parent container element Id (string)
            -   Answers (array)
    */
    function Quizlyio(elId) {
        _classCallCheck(this, Quizlyio);

        var container = document.getElementById(elId);
        var questions = container.getElementsByClassName('quizlyio-question');
        var quizJson = {};

        for (var i = 0; i < questions.length; i++) {

            var question = questions[i];
            var dataset = question.dataset;

            var q = "q" + dataset.quizlyioQuestion;
            quizJson[q] = {};
            quizJson[q].answer = dataset.quizlyioAnswer;
            quizJson[q].response = null;
            quizJson[q].correct = null;
        }

        this.el = {};
        this.el.container = container;
        this.el.id = elId;
        this.el.questions = questions;

        this.data = {};
        this.data.quizLength = questions.length;
        this.data.quizJson = quizJson;

        this.AddClickListeners();
    }

    _createClass(Quizlyio, [{
        key: "CompleteQuiz",
        value: function CompleteQuiz() {
            var quizJson = this.data.quizJson;
            var numberCorrect = 0;

            //console.log(quizJson);
            //console.log(this.data.quizLength);

            for (var i = 0; i < this.data.quizLength; i++) {
                var n = i + 1,
                    q = "q" + n;

                //console.log(q);
                //console.log(quizJson[q]);

                //this.CheckAnswer(n);

                if (quizJson[q].correct == true) {
                    numberCorrect += 1;
                } else if (quizJson[q].correct == null) {
                    // Throws an error if you haven't answered all questions
                    this.HighlightQuestion(n);
                    return;
                }
            }

            this.data.numberCorrect = numberCorrect;

            var percent = numberCorrect / this.data.quizLength * 100;
            this.data.percentCorrect = percent;

            document.getElementById('quizlyio-result').style.display = "block";
            document.getElementById('quizlyio-score').innerHTML = numberCorrect;
            document.getElementById('quizlyio-max-score').innerHTML = this.data.quizLength;
            //document.getElementById('quizlyio-percent').innerHTML=percent+"%";

            if (percent >= 80) {
                document.getElementById('quizlio-score-80').style.display = "block";
            } else if (percent >= 50) {
                document.getElementById('quizlio-score-50').style.display = "block";
            } else {
                document.getElementById('quizlio-score-40').style.display = "block";
            }

            dataLayer.push({
                event: 'ga-event',
                eventCategory: 'Quiz',
                eventLabel: 'Completed',
                eventAction: percent
            });

            return percent + "%";
        }
    }, {
        key: "HighlightQuestion",
        value: function HighlightQuestion(questionNumber) {
            console.log("didn't answer question " + questionNumber);
            return;
        }
    }, {
        key: "AddClickListeners",
        value: function AddClickListeners() {
            var container = this.el.container;
            var inputs = container.getElementsByTagName('input');

            var that = this;

            for (var i = 0; i < inputs.length; i++) {

                var input = inputs[i];

                input.onclick = function () {
                    var q = this.name.split("q")[1];
                    //console.log(q);
                    that.CheckAnswer(q);

                    return;
                };
            }
        }
    }, {
        key: "RelvealAnswer",
        value: function RelvealAnswer(questionNumber) {
            var question = this.el.questions[questionNumber - 1];

            // This could be done nicer and a bit more robustly.
            question.getElementsByClassName('quizlyio-question-reveal')[0].classList.add('quizlyio-show');
        }

        /*
            Method to check the answer to a question. This is referred to by all other methods.
            Will reveal the response below by default.
        */

    }, {
        key: "CheckAnswer",
        value: function CheckAnswer(questionNumber) {

            if (questionNumber == 0 || questionNumber > this.data.quizLength) {
                return false;
            }

            var q = "q" + questionNumber,
                radios = document.getElementsByName(q);

            var status;

            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {

                    var response = radios[i].value;

                    this.data.quizJson[q].response = response;

                    var ans = this.data.quizJson[q].answer;

                    if (response == ans) {
                        //radios[i].parentElement.classList.add('quizlyio-correct');
                        status = true;
                    } else {
                        //radios[i].parentElement.classList.add('quizlyio-wrong');
                        status = false;
                    }

                    this.HandleResponse(questionNumber, status);
                    this.data.quizJson[q].correct = status;

                    break;
                }
            }

            if (this.CheckCompletionStatus()) {
                this.CompleteQuiz();
            }

            return status;
        }
    }, {
        key: "CheckCompletionStatus",
        value: function CheckCompletionStatus() {
            var quizJson = this.data.quizJson;

            for (var i = 0; i < this.data.quizLength; i++) {
                var n = i + 1,
                    q = "q" + n;
                if (quizJson[q].response == null) {
                    return false;
                }
            }
            return true;
        }
    }, {
        key: "HandleResponse",
        value: function HandleResponse(questionNumber, response) {
            var quizJson = this.data.quizJson;

            var question = quizJson["q" + questionNumber];
            var resp = question.response;
            var answ = question.answer;
            var corr = question.correct;

            var questionEl = this.el.questions[questionNumber - 1],
                inputs = questionEl.getElementsByTagName('input');

            for (var i = 0; i < inputs.length; i++) {

                var input = inputs[i],
                    val = input.value;

                //console.log( "Resp = " + resp + " : Answ = " + answ + " : Corr = " + corr + " : VAL = " + val );

                // If val is the answer make it correct
                if (val == answ) {
                    input.parentElement.classList.add('quizlyio-correct');
                } else if (val == resp) {
                    input.parentElement.classList.add('quizlyio-wrong');
                } else if (corr) {
                    input.parentElement.classList.add('quizlyio-correct');
                }
            }

            this.RelvealAnswer(questionNumber);
        }
    }]);

    return Quizlyio;
}();

var quizlyio;

$(function () {
    quizlyio = new Quizlyio('quizlyio-container');
});