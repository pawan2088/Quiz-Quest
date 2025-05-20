const opt = document.querySelectorAll(".opt-pg2");
const options_pg2 = document.querySelector(".options-pg2");
const next = document.getElementById("next-btn-pg2");
const questionElement = document.querySelector(".question-pg2");
const timerElement = document.getElementById("time-left");
const currentQuestionElement = document.getElementById("current-question");
const totalQuestionsElement = document.getElementById("total-questions");
const loadingElement = document.getElementById("loading");


let queArray = [];
let currentQue = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let finalScore = 0;
let que = '';
let correctOption = '';
let allOptions = [];
let answerSelected = false;
let timer;
let timeLeft = 30;


const totalQuestions = sessionStorage.getItem("value") || 10;
totalQuestionsElement.textContent = totalQuestions;


function startTimer() {
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerElement.style.color = "#dc3545";
        } else {
            timerElement.style.color = "#000";
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}


function handleTimeUp() {
    const options = document.querySelectorAll(".opt-pg2");
    options.forEach(option => {
        option.classList.remove("hover-eff");
        if (option.innerText === correctOption) {
            option.classList.add("correct");
        } else {
            option.classList.add("incorrect");
        }
    });
    
    incorrectAnswers++;
    answerSelected = true;
    next.style.display = "block";
}

window.addEventListener("load", callApi);

async function callApi() {
    try {
     
        loadingElement.style.display = "flex";
        
        const categoryNo = categoryType();
        const questionNo = totalQuestions;
        const mode = sessionStorage.getItem("mode") || "easy";
        
        const api = `https://opentdb.com/api.php?amount=${questionNo}&category=${categoryNo}&difficulty=${mode}&type=multiple`;
        
        const req = await fetch(api);
        const conv = await req.json();
        
   
        if (conv.response_code !== 0 || !conv.results || conv.results.length === 0) {
            throw new Error("Couldn't load questions. Please try a different category or difficulty.");
        }
        
        queArray = conv.results;
        
      
        sessionStorage.setItem("correctAnswers", "0");
        sessionStorage.setItem("incorrectAnswers", "0");
        
   
        loadingElement.style.display = "none";
        
    
        currentQue = 0;
        extractData();
    } catch (error) {
       
        loadingElement.style.display = "none";
        
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.innerHTML = `
            <p>${error.message || "Something went wrong. Please try again."}</p>
            <button class="retry-btn" onclick="location.href='index.html'">Go Back</button>
        `;
        
        document.querySelector(".container-pg2").appendChild(errorMessage);
    }
}


function randomizeOptions(correct, incorrect) {
    const options = [...incorrect];
    const randomIndex = Math.floor(Math.random() * 4);
    options.splice(randomIndex, 0, correct);
    return options;
}


function extractData() {
   
    while (options_pg2.firstChild) {
        options_pg2.removeChild(options_pg2.firstChild);
    }
    
   
    answerSelected = false;
    
  
    if (currentQue >= queArray.length) {
        endQuiz();
        return;
    }
    
   
    currentQuestionElement.textContent = currentQue + 1;
    
   
    que = queArray[currentQue].question;
    correctOption = queArray[currentQue].correct_answer;
    const incorrectOptions = queArray[currentQue].incorrect_answers;
    
   
    allOptions = randomizeOptions(correctOption, incorrectOptions);
    
    questionElement.innerHTML = decodeHTML(que);
    
   
    allOptions.forEach(option => {
        const optionButton = document.createElement("button");
        optionButton.classList.add("opt-pg2", "hover-eff");
        optionButton.innerText = decodeHTML(option);
        options_pg2.appendChild(optionButton);
        
        
        optionButton.addEventListener("click", () => {
            if (!answerSelected) {
                selectAnswer(optionButton);
            }
        });
    });
    
   
    next.style.display = "none";
    
    
    startTimer();
}


function selectAnswer(selectedOption) {
    
    clearInterval(timer);
    
    
    answerSelected = true;
    
    
    const options = document.querySelectorAll(".opt-pg2");
    
    
    options.forEach(option => {
        option.classList.remove("hover-eff");
        
        if (option.innerText === correctOption) {
            option.classList.add("correct");
        } else {
            option.classList.add("incorrect");
        }
    });
    
    
    if (selectedOption.innerText === correctOption) {
        correctAnswers++;
        sessionStorage.setItem("correctAnswers", correctAnswers.toString());
    } else {
        incorrectAnswers++;
        sessionStorage.setItem("incorrectAnswers", incorrectAnswers.toString());
    }
    
    
    next.style.display = "block";
}


function endQuiz() {
    
    finalScore = Math.round((correctAnswers / queArray.length) * 100);
    
    
    sessionStorage.setItem("totalScore", finalScore.toString());
    sessionStorage.setItem("totalQuestions", queArray.length.toString());
    
    
    window.location.href = "results.html";
}


next.addEventListener("click", () => {
    currentQue++;
    extractData();
});


function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
