// Define quiz questions and answers
const quiz = [
    {
      question: "What is the capital of France?",
      choices: ["London", "Paris", "Berlin", "Madrid"],
      answer: "Paris"
    },
    {
      question: "What is the largest planet in our solar system?",
      choices: ["Jupiter", "Saturn", "Neptune", "Earth"],
      answer: "Jupiter"
    },
    {
      question: "What is the tallest mammal?",
      choices: ["Elephant", "Giraffe", "Hippopotamus", "Kangaroo"],
      answer: "Giraffe"
    },
    {
      question: "Whatis the smallest country in the world?",
    choices: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"],
    answer: "Vatican City"
    },
    {
    question: "What is the highest mountain in Africa?",
    choices: ["Mount Everest", "Mount Kilimanjaro", "Mount Fuji", "Mount McKinley"],
    answer: "Mount Kilimanjaro"
    }
];

// Set the initial values
let questionIndex = 0;
let timeLeft = 60;
let timerId;

// Get elements from the DOM
const startButton = document.getElementById("start");
const timer = document.getElementById("timer");
const question = document.getElementById("question");
const choices = document.getElementById("choices");
const message = document.getElementById("message");
const submitForm = document.getElementById("submit-form");
const initialsInput = document.getElementById("initials");
const saveScoreButton = document.querySelector("button[type='submit']");
const yourScore = document.getElementById("your-score");
const scoreboard = document.getElementById("score-board");
const scoreTable = document.getElementById("score-table");
const tryingscores = document.getElementById("trying-scores");

// Hide the quiz elements
timer.style.display = "none";
question.style.display = "none";
choices.style.display = "none";
message.style.display = "none";
submitForm.style.display = "none";
scoreboard.style.display = "none";

// Function to start the quiz
function startQuiz() {
// Hide the start button
startButton.style.display = "none";
// Show the quiz elements
timer.style.display = "block";
question.style.display = "block";
choices.style.display = "block";
// Start the timer
timerId = setInterval(updateTimer, 1000);
// Display the first question
displayQuestion();
}

// Function to update the timer
function updateTimer() {
timeLeft--;
timer.textContent = 'Time:' + timeLeft;
// If time runs out, end the quiz
if (timeLeft <= 0) {
endQuiz();
}
}

// Function to display a question
function displayQuestion() {
    // Get the current question object from the quiz array
    const currentQuestion = quiz[questionIndex];
    // Display the question text
    question.textContent = currentQuestion.question;
    // Clear the previous choices
    choices.innerHTML = "";
    // Loop through the choices and create a button for each one
    currentQuestion.choices.forEach(function(choice) {
        const button = document.createElement("button");
        button.textContent = choice;
        // Add an event listener to the button
        button.addEventListener("click", function() {
            // Check if the answer is correct
            if (choice === currentQuestion.answer) {
                // Display a success message
                message.style.display = "block";
                message.textContent = "Correct!";
                message.style.color = "green";
                var audio = new Audio("./Main/assets/sfx/correct.wav");
                audio.play();
                // Move on to the next question
                questionIndex++;
                // If all questions have been answered, end the quiz
                if (questionIndex === quiz.length) {
                endQuiz();
                } else {
                displayQuestion();
                }
            } else {
            // Display an error message and subtract time
            message.style.display = "block";
            message.textContent = "Wrong!";
            message.style.color = "red";
            var audio = new Audio("./Main/assets/sfx/incorrect.wav");
            audio.play();
            timeLeft -= 10;
            // If time runs out, end the quiz
            if (timeLeft <= 0) {
            endQuiz();
            }}
        });
        choices.appendChild(button);
    });
}

// Function to end the quiz
function endQuiz() {
  // Stop the timer
  clearInterval(timerId);
  // Hide the quiz elements
  timer.style.display = "none";
  question.style.display = "none";
  choices.style.display = "none";
  scoreboard.style.display = "none";
  message.style.display = "none";
  // Display the submit form
  submitForm.style.display = "block";
  yourScore.textContent = "your score is " + timeLeft;
  localStorage.setItem("your-Score", yourScore);
  
}
//add function here for scoreboard much like code above, function will be called at end of submit form <-------------

// Add an event listener to the start button
startButton.addEventListener("click", startQuiz);

// Add an event listener to the submit form
submitForm.addEventListener("submit", function(event) {
    event.preventDefault();
    // Get the initials from the input field
    const initials = initialsInput.value.trim();
    // Check if the initials are valid
    if (initials === "") {
    alert("Please enter your initials.");
    return;
    }
    // Create a new score object
    const score = {
    initials: initials,
    score: timeLeft
    };
    // Get the high scores from local storage
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    // Add the new score to the high scores array
    highScores.push(score);
    // Sort the high scores by score (highest to lowest)
    highScores.sort(function(a, b) {
    return b.score - a.score;
    });
    // Truncate the high scores array to the top 10 scores
    highScores = highScores.slice(0, 10);
    // Save the high scores to local storage
    localStorage.setItem("highScores", JSON.stringify(highScores));
    // call highscores function to change display and show top 10 scores
    highscoreshere();

    //add code here that will call the scoreboard function, also need a printing loop for highscores can copy the code that makes a new line for each question<---------------------
    });

    function highscoreshere() {
 // change displayed quiz elements
 timer.style.display = "none";
 question.style.display = "none";
 choices.style.display = "none";
 submitForm.style.display = "none";
 message.style.display = "none";
 scoreboard.style.display = "block";
 // Get the high scores from local storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Get the high scores table body element from the DOM
const tableBody = document.getElementById("table-body");

// Loop through the high scores and create a row for each one. found online, moves through a table puting the items in correct spots
highScores.forEach(function(score, index) {
const row = document.createElement("tr");
const rankCell = document.createElement("td");
rankCell.textContent = index + 1;
row.appendChild(rankCell);
const initialsCell = document.createElement("td");
initialsCell.textContent = "initials: " + score.initials;
row.appendChild(initialsCell);
const scoreCell = document.createElement("td");
scoreCell.textContent = "score: " + score.score;
row.appendChild(scoreCell);
tableBody.appendChild(row);
});
}

// Add an event listener to the clear high scores button
const clearScoresButton = document.getElementById("clear-scores");
clearScoresButton.addEventListener("click", function() {
// Confirm that the user wants to clear the high scores
if (confirm("Are you sure you want to clear the high scores?")) {
// Clear the high scores from local storage
localStorage.removeItem("highScores");
// Reload the page
window.location.reload();
}
});

const playAgainButton = document.getElementById("play-again");
playAgainButton.addEventListener("click", function() {
// Confirm that the user wants to clear the high scores
window.location.reload();
});






