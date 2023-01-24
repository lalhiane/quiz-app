const URL = "https://raw.githubusercontent.com/lalhiane/quiz-app/main/data/data.json";

const container = document.getElementById("container");

const selectLang = document.getElementById("select-lang");

const startBtn = document.getElementById("start-btn");

let currentIndex = 0;

let rightAnswers = 0;

let checkIndex = 0;

let interval;

async function generate_data(url) {

    const response = await fetch(url);

    const quiz = await response.json();

    const categories = Object.keys(quiz);

    for (let i = 0; i < categories.length; i++) {

        const option = document.createElement("option");

        option.value = categories[i];

        option.innerText = categories[i];

        selectLang.appendChild(option);

    }

    let category;

    startBtn.addEventListener("click", function () {

        category = selectLang.value;

        container.innerHTML = "";
    
        create_quiz_markup(category, quiz[category]);

        choose_answer();

        generate_timer(quiz[category], 10);
    
    });

    document.addEventListener("click", function (e) {

        if (
            
            e.target.classList.contains("submit-btn") || 

            e.target.classList.contains("submit-icon")
        
        ) {

            e.preventDefault();

            check_answer(quiz[category]);

            clearInterval(interval);

            if (currentIndex < quiz[category].length - 1) {
                
                currentIndex++;

                create_quiz_markup(category, quiz[category]);

                choose_answer();

                generate_timer(quiz[category], 10);

            } else {

                generate_result(quiz[category]);

            }

            if (currentIndex < quiz[category].length) checkIndex;

        }

    });

}

generate_data(URL);

function create_quiz_markup(category, questions) {

    container.innerHTML = "";

    const target = questions[currentIndex];

    const titleEl = document.createElement("h2");

    titleEl.className = "title";

    titleEl.innerText = `${category} Quiz`;

    container.appendChild(titleEl);

    const quetionCount = document.createElement("h4");

    quetionCount.innerText = `Question ${currentIndex + 1} of ${questions.length}`;

    container.appendChild(quetionCount);

    const quetionTitle = document.createElement("h3");

    quetionTitle.className = "quetion-title";

    quetionTitle.innerText = target.title;

    container.appendChild(quetionTitle);

    const quizForm = document.createElement("form");

    quizForm.action = "#";

    quizForm.className = "quiz-form";

    const answers = ["answer_1", "answer_2", "answer_3", "answer_4"];

    answers.sort(() => Math.random() - 0.5);

    for (let i = 0; i < answers.length; i++) {

        const label = document.createElement("label");

        label.for = `input-${i + 1}`;

        label.innerHTML = `

            <input type="radio" id="input-${i + 1}" name="sameName">
            
            <span class="checkmark"></span>

        `;
        
        label.appendChild(document.createTextNode(target[answers[i]]));

        label.setAttribute("data-answer", target[answers[i]]);

        quizForm.appendChild(label);

    }

    const rowEl = document.createElement("div");

    rowEl.className = "row";

    const submitBtn = document.createElement("button");

    submitBtn.className = "btn submit-btn disabled";

    submitBtn.innerHTML = "Next <i class=\"fas fa-chevron-right submit-icon\"></i>";

    rowEl.appendChild(submitBtn);

    const timerEl = document.createElement("div");

    timerEl.className = "timer";

    timerEl.innerText = "00:10";

    rowEl.appendChild(timerEl);

    quizForm.appendChild(rowEl);

    container.appendChild(quizForm);

}

function choose_answer() {

    const answersBoxes = document.querySelectorAll("label");

    answersBoxes.forEach(box => {

        box.addEventListener("click", function () {

            answersBoxes.forEach(box => box.classList.remove("active"));

            box.classList.add("active");

            document.querySelector(".submit-btn").classList.remove("disabled");

        });

    });

}

function check_answer(questions) {

    const targetEl = document.querySelector("label.active");

    if (targetEl !== null) {

        const choosed_answer = targetEl.getAttribute("data-answer");

        if (questions[currentIndex].right_answer === choosed_answer) {
    
            rightAnswers++;
    
        }

    }

}

function generate_result(questions) {

    container.innerHTML = "";

    container.classList.add("has-result");

    const resultEl = document.createElement("p");

    resultEl.className = "result";

    const result = `You Have Got ${rightAnswers} From ${questions.length}`;

    if (rightAnswers <= Math.ceil(questions.length / 2)) {

        resultEl.innerText = `Check Your Level, ${result}`;

    } else {

        resultEl.innerText = `Congratulation, ${result}`;

    }

    container.appendChild(resultEl);

    const reloadBtn = document.createElement("button");

    reloadBtn.className = "btn";

    reloadBtn.innerText = "Reload";

    reloadBtn.addEventListener("click", () => location.reload());
    
    container.appendChild(reloadBtn);

}

function generate_timer(questions, duration) {

    if (checkIndex < questions.length) {

        let minutes, seconds;

        interval = window.setInterval(() => {
    
            minutes = parseInt(duration / 60);
    
            seconds = parseInt(duration % 60);
    
            minutes = minutes < 10  ? `0${minutes}` : minutes;
    
            seconds = seconds < 10  ? `0${seconds}` : seconds;

            const timerEl = document.querySelector(".timer");
    
            timerEl.innerHTML = `${minutes}:${seconds}`;
    
            if (--duration < 0) {
    
                clearInterval(interval);
    
                document.querySelector(".submit-btn").click();
    
            }
    
        }, 1000);

    }

}