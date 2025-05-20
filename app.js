const button = document.querySelectorAll(".btn");
const mode = document.querySelectorAll(".mode");
const modes = document.querySelector(".modes");
const submit = document.querySelector(".submit");
const text_box = document.querySelector("#count");
const closePopupBtn = document.querySelector(".close-popup");
let modeInitial = "easy";


window.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("mode", modeInitial);
    // Reset scores when starting a new quiz
    sessionStorage.removeItem("correctAnswers");
    sessionStorage.removeItem("incorrectAnswers");
    sessionStorage.removeItem("totalScore");
});


button.forEach((e) => {
    
    if (!e.classList.contains("category-title")) {
        e.addEventListener("click", () => {
            sessionStorage.setItem("category", e.innerText);
            document.querySelector(".pop").classList.add("popup");
        });
    }
});


if (closePopupBtn) {
    closePopupBtn.addEventListener("click", () => {
        document.querySelector(".pop").classList.remove("popup");
    });
}


if (text_box !== null) {
    text_box.addEventListener("input", () => {
        if (text_box.value > 20) {
            text_box.value = 20;
        } else if (text_box.value < 1 && text_box.value !== "") {
            text_box.value = 1;
        }
        sessionStorage.setItem("value", text_box.value);
    });
}


if (submit !== null) {
    submit.addEventListener("click", (event) => {
        if (text_box.value <= 0 || text_box.value > 20 || isNaN(text_box.value)) {
            event.preventDefault();
            alert("Please enter a number between 1 and 20");
        }
    });
}


mode.forEach((e) => {
    e.addEventListener("click", () => {
        modeInitial = e.id;
        sessionStorage.setItem("mode", modeInitial);
    });
});


function categoryType(category) {
    if (!category) {
        category = sessionStorage.getItem("category");
    }
    
    const categoryMap = {
        "General Knowledge": 9,
        "Books": 10,
        "Film": 11,
        "Music": 12,
        "Musical & Theatres": 13,
        "Television": 14,
        "Video Games": 15,
        "Board Games": 16,
        "Science & Nature": 17,
        "Computers": 18,
        "Mathematics": 19,
        "Sports": 21,
        "Geography": 22,
        "History": 23,
        "Politics": 24,
        "Art": 25,
        "Celebrities": 26,
        "Animals": 27,
        "Vehicles": 28
    };
    
    return categoryMap[category] || -1;
}
