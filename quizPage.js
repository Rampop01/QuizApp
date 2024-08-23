//  QuizQues page functionality
let questions = [];
let currentQuestionIndex = 0;
let timer;
let timeLeft = 60 * 60;
const answers = [];

const questionContainer = document.getElementById("question-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");
const feedbackModal = document.getElementById("feedback-modal");
const feedbackMessage = document.getElementById("feedback-message");
const closeFeedback = document.getElementById("close-feedback");
const timerDisplay = document.getElementById("timer");
const answeredCountDisplay = document.getElementById("answered-count");

// Fetch questions and initialize quiz after loading
fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    answers.length = questions.length;
    initializeQuiz();
  })
  .catch((error) => console.error("Error loading questions:", error));

function initializeQuiz() {
  loadQuestion(currentQuestionIndex);
  startTimer();
}

function loadQuestion(index) {
  const question = questions[index];
  if (!question) return;

  questionContainer.innerHTML = `
    <h2 class="text-xl font-bold mb-4">${question.question}</h2>
    ${question.options
      .map(
        (option, i) => `
      <div class="mb-2">
        <input type="radio" id="option${i}" name="option" value="${option}" class="mr-2" ${
          answers[index] === option ? "checked" : ""
        } />
        <label for="option${i}">${option}</label>
      </div>
    `
      )
      .join("")}
  `;
  prevButton.disabled = index === 0;
  nextButton.textContent = index === questions.length - 1 ? "Finish" : "Next";
  submitButton.classList.toggle("hidden", index !== questions.length - 1);
  answeredCountDisplay.textContent = `Question ${index + 1} of ${
    questions.length
  }`;
}

function handleNavigation(step) {
  saveAnswer();
  currentQuestionIndex += step;
  if (currentQuestionIndex < 0) currentQuestionIndex = 0;
  if (currentQuestionIndex >= questions.length)
    currentQuestionIndex = questions.length - 1;
  loadQuestion(currentQuestionIndex);
}

function saveAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    answers[currentQuestionIndex] = selectedOption.value;
  }
}

function showFeedback() {
  const score = answers.filter(
    (answer, index) => answer === questions[index].answer
  ).length;
  feedbackMessage.innerHTML = `Your score is: ${score} / ${questions.length}`;
  feedbackModal.classList.remove("hidden");
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time is up! The quiz has ended.");
      showFeedback();
    } else {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
      timeLeft--;
    }
  }, 1000);
}

prevButton.addEventListener("click", () => handleNavigation(-1));
nextButton.addEventListener("click", () => {
  if (currentQuestionIndex === questions.length - 1) {
    showFeedback();
    clearInterval(timer);
  } else {
    handleNavigation(1);
  }
});
submitButton.addEventListener("click", () => {
  showFeedback();
  clearInterval(timer);
});
closeFeedback.addEventListener("click", () =>
  feedbackModal.classList.add("hidden")
);
