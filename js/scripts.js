const URL = "https://raw.githubusercontent.com/lalhiane/quiz-app/main/data/data.json";

const quizDesc = document.getElementById("quiz-desc");

const bullets = document.querySelector(".bullets");

const timerEl = document.querySelector(".timer");

const outerPopup = document.querySelector(".outer-popup");

let currentIndex = 0;

let rightAnswers = 0;

let wrongAnswers = 0;

let interval;

let for_generate_categories = true;

let for_generate_bullets = true;

var outerCategory = "programming";

let shuffledQuestions;

async function get_data(url, category = "programming") {

    const response = await fetch(url);

    const quiz = await response.json();

    const categories = Object.keys(quiz);

    const questions = quiz[category];

    if (for_generate_bullets) {

        shuffledQuestions = questions.sort(() => Math.random() - 0.5);

        generate_bullets(shuffledQuestions);

        for_generate_bullets = false;

    }

    if (for_generate_categories) {

        generate_categories(categories, shuffledQuestions);

        for_generate_categories = false;

    }

    create_quiz_markup(shuffledQuestions);

    check_answer();

    // generate_timer(questions, 5);

}

get_data(URL);

function create_quiz_markup(questions) {

    quizDesc.innerHTML = "";

    const target = questions[currentIndex];

    const quizForm = document.createElement("div");

    quizForm.className = "quiz-form";

    const quetionTitle = document.createElement("h3");

    quetionTitle.className = "quetion-title";

    quetionTitle.innerText = target.title;

    quizForm.appendChild(quetionTitle);
    
    let answers = ["answer_1", "answer_2", "answer_3", "answer_4"];

    let shuffledAnswers = answers.sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffledAnswers.length; i++) {
        
        const answerBox = document.createElement("div");

        answerBox.className = "answer-box";

        answerBox.innerText = target[shuffledAnswers[i]];

        quizForm.appendChild(answerBox);

    }

    const submitBtn = document.createElement("button");

    submitBtn.className = "submit-btn disabled";

    submitBtn.innerText = "Submit Answer";

    submitBtn.addEventListener("click", () => generate_quiz(questions));

    quizForm.appendChild(submitBtn);

    quizDesc.appendChild(quizForm);

}

const classes = ["fas fa-code", "fas fa-language"]

function generate_categories(categories, questions) {

    categories.forEach((category, index) => {

        const spanEl = document.createElement("span");

        spanEl.addEventListener("click", () => {

            const AllSpans = document.querySelectorAll(".categories-part span");

            AllSpans.forEach(span => span.classList.remove("active"));

            spanEl.classList.add("active");

            for_generate_bullets = true;

            get_data(URL, category);

            outerCategory = category;

            generate_bullets(questions);

        });

        if (index === 0) spanEl.classList.add("active");

        spanEl.innerHTML = `
            <h6>${category}</h6>
            <i class="${classes[index]}"></i>
        `;

        document.querySelector(".categories-part").appendChild(spanEl);

    });

}

function generate_quiz(questions) {

    document.querySelectorAll(".categories-part span").forEach(span => {

        span.classList.add("disabled");

    });

    clearInterval(interval);

    timerEl.innerHTML = "00:05";

    const targetBox = document.querySelector(".answer-box.active");

    if (targetBox !== null) {

        const rightAnswer = questions[currentIndex].right_answer

        if (targetBox.innerText === rightAnswer) rightAnswers++;
        
        else wrongAnswers++;

    } else wrongAnswers++;

    if (currentIndex < questions.length - 1) currentIndex++;
    
    else generate_results(questions);

    get_data(URL, outerCategory);

    bullets.querySelectorAll("li")[currentIndex].classList.add("active");

}

function check_answer() {

    const answerBoxes = document.querySelectorAll(".answer-box");

    answerBoxes.forEach(box => {

        box.addEventListener("click", (e) => {
    
            answerBoxes.forEach(box => box.classList.remove("active"));
    
            e.target.classList.add("active");
    
            document.querySelector(".submit-btn").classList.remove("disabled");

        });

    });

}

function generate_bullets(questions) {

    bullets.innerHTML = "";

    for (let i = 0; i < questions.length; i++) {

        const bullet = document.createElement("li");

        if (i === 0) bullet.className = "active";

        bullet.innerText = i + 1;

        bullets.appendChild(bullet);
    }

}

function generate_timer(questions, duration) {

    if (currentIndex < questions.length - 1) {

        let minutes, seconds;

        interval = window.setInterval(() => {
    
            minutes = parseInt(duration / 60);
    
            seconds = parseInt(duration % 60);
    
            minutes = minutes < 10  ? `0${minutes}` : minutes;
    
            seconds = seconds < 10  ? `0${seconds}` : seconds;
    
            timerEl.innerHTML = `${minutes}:${seconds}`;
    
            if (--duration < 0) {
    
                clearInterval(interval);
    
                document.querySelector(".submit-btn").click();
    
            }
    
        }, 1000);

    }

}

function generate_results(questions) {

    outerPopup.classList.add("outer-show");

    const innerPopup = document.createElement("div");

    innerPopup.className = "inner-popup";

    const result = `You Have Got ${rightAnswers} From ${questions.length}`

    if (rightAnswers <= Math.ceil(questions.length / 2)) {

        innerPopup.innerText = `Check Your Level, ${result}`;

    } else {

        innerPopup.innerText = `Congratulation, ${result}`;

    }

    const closePopup = document.createElement("i");

    closePopup.className = "fa fa-times close-popup";

    closePopup.addEventListener("click", () => window.location.reload());

    innerPopup.appendChild(closePopup);

    window.setTimeout(() => innerPopup.classList.add("inner-show"), 300);

    outerPopup.appendChild(innerPopup);

}
