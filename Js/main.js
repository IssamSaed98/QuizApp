// DOM Elements
let countSpan = document.querySelector(".count span");
let bulletSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answer-area');
let bullets = document.querySelector('.bullets');
let submitButton = document.querySelector('.btn');
let result = document.querySelector('.result');
let countDown = document.querySelector('.countDown');

// Prompt for Student Name
let studentName = prompt("Welcome in Quiz App .. Please Enter Your Name.");

// Set Data
let currentIndex = 0;
let correctAnswers = 0;
let countDownInterval;

// Fetch Questions
function getQuestions() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText);
            let questionCount = questions.length;

            createBullets(questionCount);
            loadQuestion(questions[currentIndex], questionCount);
            startCountDown(15, questionCount);

            submitButton.onclick = () => {
                let correctAnswer = questions[currentIndex].right_answer;

                checkAnswer(correctAnswer, questionCount);

                // Clear areas for next question
                quizArea.innerHTML = '';
                answerArea.innerHTML = '';

                currentIndex++;

                if (currentIndex < questionCount) {
                    loadQuestion(questions[currentIndex], questionCount);
                    handleBullets();
                    clearInterval(countDownInterval);
                    startCountDown(15, questionCount);
                }

                showResult(questionCount);
            };
        }
    };

    xhr.open("GET", "htmlQ2.json", true);
    xhr.send();
}
getQuestions();

// Create Bullets
function createBullets(num) {
    countSpan.innerHTML = num;

    for (let i = 0; i < num; i++) {
        let bullet = document.createElement("span");
        bullet.textContent = `${i + 1}`;
        if (i === 0) {
            bullet.classList.add("on");
        }
        bulletSpanContainer.appendChild(bullet);
    }
}

// Load Question Data
function loadQuestion(question, totalQuestions) {
    if (currentIndex < totalQuestions) {
        let questionTitle = document.createElement('h2');
        questionTitle.className = 'an wow flipInY';
        questionTitle.textContent = question.title;
        quizArea.appendChild(questionTitle);

        for (let i = 1; i <= 4; i++) {
            let answerDiv = document.createElement("div");
            answerDiv.className = "answer wow fadeInDown";

            let radioInput = document.createElement('input');
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = question[`answer_${i}`];
            if (i === 1) {
                radioInput.checked = true;
            }

            let label = document.createElement('label');
            label.htmlFor = `answer_${i}`;
            label.textContent = question[`answer_${i}`];

            answerDiv.appendChild(radioInput);
            answerDiv.appendChild(label);
            answerArea.appendChild(answerDiv);
        }
    }
}

// Check Answer
function checkAnswer(correctAnswer, totalQuestions) {
    let answers = document.getElementsByName('question');
    let selectedAnswer;

    answers.forEach(answer => {
        if (answer.checked) {
            selectedAnswer = answer.dataset.answer;
        }
    });

    if (selectedAnswer === correctAnswer) {
        correctAnswers++;
        console.log(`Correct! The right answer is ${correctAnswer}`);
    }
}

// Handle Bullets
function handleBullets() {
    let allBullets = Array.from(document.querySelectorAll('.bullets .spans span'));
    allBullets.forEach((bullet, index) => {
        if (currentIndex === index) {
            bullet.classList.add('on');
        }
    });
}

// Show Result
function showResult(totalQuestions) {
    if (currentIndex === totalQuestions) {
        quizArea.remove();
        answerArea.remove();
        bullets.remove();
        submitButton.remove();

        let resultMessage;
        if (correctAnswers > totalQuestions / 2 && correctAnswers < totalQuestions) {
            resultMessage = `<div class="wow wobble"><span class="good wow fadeInLeft">Good</span>, You solved ${correctAnswers} out of ${totalQuestions}. Well done, ${studentName}!</div>`;
        } else if (correctAnswers === totalQuestions) {
            resultMessage = `<div class="wow wobble"><span class="perfect wow fadeInLeft">Perfect!</span> All answers are correct, ${studentName}!</div>`;
        } else {
            resultMessage = `<div class="wow wobble"><span class="bad wow fadeInLeft">Bad</span>, You solved ${correctAnswers} out of ${totalQuestions}. Better luck next time, ${studentName}!</div>`;
        }

        result.innerHTML = resultMessage;
    }
}

// Start Countdown
function startCountDown(duration, totalQuestions) {
    if (currentIndex < totalQuestions) {
        let minutes, seconds;

        countDownInterval = setInterval(() => {
            minutes = Math.floor(duration / 60);
            seconds = duration % 60;

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDown.innerHTML = `<i class="fa-solid fa-clock"></i> ${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}
