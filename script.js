/**
 * Math Flashcard Game – script.js
 *
 * Public API
 * ----------
 *  generateQuestion()  – builds a new random arithmetic problem and updates the DOM
 *  checkAnswer()       – validates the current input against the correct answer
 *
 * Internal helpers
 * ----------------
 *  startTimer()        – kicks off the 60-second countdown
 *  stopTimer()         – clears the interval
 *  updateScoreDisplay()– syncs the score element with the current score
 *  showGameOver()      – reveals the end-of-game screen
 *  startGame()         – resets all state and begins a fresh round
 */

'use strict';

// ── DOM references ──────────────────────────────────────────────────────────
const questionEl    = document.getElementById('question');
const answerInput   = document.getElementById('answer-input');
const submitBtn     = document.getElementById('submit-btn');
const feedbackEl    = document.getElementById('feedback');
const scoreEl       = document.getElementById('score');
const timerEl       = document.getElementById('timer');
const gameArea      = document.getElementById('game-area');
const gameOverArea  = document.getElementById('game-over');
const finalScoreEl  = document.getElementById('final-score');
const restartBtn    = document.getElementById('restart-btn');

// ── Game state ───────────────────────────────────────────────────────────────
let correctAnswer = 0;
let score         = 0;
let timeLeft      = 60;
let timerInterval = null;

// ── Operations available in the game ─────────────────────────────────────────
const OPERATIONS = ['+', '-', '×'];

// ── Helper: random integer in [min, max] ──────────────────────────────────────
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * generateQuestion
 * Creates a random arithmetic problem appropriate for primary school students:
 *   - Addition:       operands 1–20
 *   - Subtraction:    operands 1–20, result always ≥ 0
 *   - Multiplication: operands 1–10
 * Updates the question display and stores the correct answer.
 */
function generateQuestion() {
  const op = OPERATIONS[randomInt(0, OPERATIONS.length - 1)];

  let a, b;

  if (op === '+') {
    a = randomInt(1, 20);
    b = randomInt(1, 20);
    correctAnswer = a + b;
  } else if (op === '-') {
    a = randomInt(1, 20);
    b = randomInt(1, a);          // ensure non-negative result
    correctAnswer = a - b;
  } else {                        // ×
    a = randomInt(1, 10);
    b = randomInt(1, 10);
    correctAnswer = a * b;
  }

  questionEl.textContent = `${a}  ${op}  ${b}  =  ?`;
}

/**
 * checkAnswer
 * Reads the value from the answer input, compares it to correctAnswer,
 * updates the score and feedback message, then loads the next question.
 */
function checkAnswer() {
  const userAnswer = answerInput.value.trim();

  if (userAnswer === '') return;   // ignore empty submissions

  if (parseInt(userAnswer, 10) === correctAnswer) {
    score += 1;
    updateScoreDisplay();
    showFeedback('✅ Correct!', 'correct');
  } else {
    showFeedback(`❌ Oops! The answer was ${correctAnswer}`, 'wrong');
  }

  answerInput.value = '';
  generateQuestion();
  answerInput.focus();
}

// ── Internal helpers ─────────────────────────────────────────────────────────

function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
}

function updateScoreDisplay() {
  scoreEl.textContent = score;
}

function startTimer() {
  timerEl.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 10) {
      timerEl.style.color = '#e53935';  // red urgency
    }

    if (timeLeft <= 0) {
      stopTimer();
      showGameOver();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function showGameOver() {
  gameArea.classList.add('hidden');
  gameOverArea.classList.remove('hidden');
  gameOverArea.classList.add('visible');
  finalScoreEl.textContent = score;
}

/**
 * startGame
 * Resets all mutable state to initial values and begins a fresh game session.
 */
function startGame() {
  score    = 0;
  timeLeft = 60;
  timerEl.style.color = '';       // reset timer color

  updateScoreDisplay();
  stopTimer();

  gameOverArea.classList.remove('visible');
  gameOverArea.classList.add('hidden');
  gameArea.classList.remove('hidden');

  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';

  generateQuestion();
  answerInput.value = '';
  answerInput.focus();
  startTimer();
}

// ── Event listeners ──────────────────────────────────────────────────────────

submitBtn.addEventListener('click', checkAnswer);

answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

restartBtn.addEventListener('click', startGame);

// ── Boot ─────────────────────────────────────────────────────────────────────
startGame();
