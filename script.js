const CODE_LEN = 4; 
const MAX_ATTEMPTS = 6;
const DIGIT_DURATION = 380;
let secret = [];
let attempts = [];
let currentGuess = [];
let gameOver = false;
let startTime = null; 

const reelEl = document.getElementById('reel');
const slotsEl = document.getElementById('slots');
const historyEl = document.getElementById('history');
const statusEl = document.getElementById('status');
const attemptsLeftEl = document.getElementById('attemptsLeft');
const flash = document.getElementById('flash');
const modalBackdrop = document.getElementById('modalBackdrop');
const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const resultBtn = document.getElementById('resultBtn');

function anyModalOpen() {
    return modalBackdrop.classList.contains('show') || resultModal.classList.contains('show');
}

document.getElementById('howToBtn').addEventListener('click', () => modalBackdrop.classList.add('show'));
document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => document.getElementById(btn.dataset.close).classList.remove('show'));
});

function buildReel() {
    reelEl.innerHTML = '';
    for (let i = 0; i < 400; i++) {
        const d = document.createElement('div');
        d.className = 'digit';
        d.textContent = i % 10;
        reelEl.appendChild(d);
    }
}

function newSecret() {
    const pool = [0,1,2,3,4,5,6,7,8,9];
    let length = pool.length - 1;
    for (let i = length; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, CODE_LEN);
}

function newGame() {
    secret = newSecret(); 
    attempts = [];
    currentGuess = [];
    gameOver = false;
    renderHistory();
    renderSlots();
    updateStatus();
}

function startReel() {
    reelEl.style.animation = 'reelScroll ' + (10 * DIGIT_DURATION) + 'ms linear infinite';
    startTime = performance.now();
}

function evaluate(guess) {
    const feedback = new Array(CODE_LEN).fill('gray');
    for (let i = 0; i < CODE_LEN; i++) {
        if (guess[i] === secret[i]) {
            feedback[i] = 'green';
        }
    }
    return feedback;
}

function renderHistory() {
    historyEl.innerHTML = '';
    attempts.forEach(a => {
        const row = document.createElement('div');
        row.className = 'hrow';
        a.guess.forEach((digit, i) => {
            const c = document.createElement('div');
            c.className = 'hcell ' + a.feedback[i];
            c.textContent = digit;
            row.appendChild(c);
        });
        historyEl.appendChild(row);
    });
    historyEl.scrollTop = historyEl.scrollHeight;
}

function renderSlots() {
    slotsEl.innerHTML = '';
    for (let i = 0; i < CODE_LEN; i++) {
        const s = document.createElement('div');
        if (i < currentGuess.length) {
            s.className = 'slot';
            s.textContent = currentGuess[i];
        }
        else {
            s.className = 'slot empty';
            s.textContent = '.';
        }
        slotsEl.appendChild(s);
    }
}

function updateStatus() {
    statusEl.textContent = gameOver ? 'meow' : 'slot ' + (currentGuess.length + 1) + ' of ' + CODE_LEN;
    const left = MAX_ATTEMPTS - attempts.length;
    if (left > 0) {
        attemptsLeftEl.textContent = left + (left === 1 ? ' guess left' : ' guesses left');
    }
    else{
        attemptsLeftEl.textContent = attempts.length + ' guesses so far';

    }
}

function currentDigitIndex(elapsed) {
    return Math.floor(elapsed / DIGIT_DURATION);

}

function catchDigit() {
    if (gameOver || currentGuess.length >= CODE_LEN || anyModalOpen()) {
        return;
    }
    const elapsed = performance.now() - startTime;
    const idx = currentDigitIndex(elapsed);
    const digit = idx % 10;
    currentGuess.push(digit);
    renderSlots();
    updateStatus();
    if (currentGuess.length === CODE_LEN) {
        submitGuess();
    }
}

function openResultModal(title, message, actionLabel, action) {
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    resultBtn.textContent = actionLabel;
    resultBtn.onclick = () => {
        
        resultModal.classList.remove('show');
        action();
    };
    resultModal.classList.add('show');
}
function submitGuess() {
    const feedback = evaluate(currentGuess);
    attempts.push({ guess: currentGuess.slice(), feedback });
    renderHistory();
    const won = feedback.every(f => f === 'green');
    if (won) {
        gameOver = true;
        const n = attempts.length;
        playWinSound(); 
        flashLight();
        const msg = n <= MAX_ATTEMPTS 
            ? 'you cracked the code in ' + n + (n === 1 ? ' guess.' : ' guesses.')
            : 'took ' + n + ' guesses - ' + (n - MAX_ATTEMPTS) + ' over the fair try.';
            openResultModal('you win!', msg, 'play again', newGame);
    }
    else if (attempts.length === MAX_ATTEMPTS){

        openResultModal('six tries up!', 'keep trying if you wish now.', 'continue', () => {});
        currentGuess = [];
        renderSlots();

    }
    else {
        currentGuess = [];
        renderSlots();
    }
    updateStatus(); 

}

function flashLight() {
    flash.classList.add('show');
    setTimeout(() => flash.classList.remove('show'), 400);
}

const winSound = new Audio("sound/win.mp3");

function playWinSound() {
    winSound.currentTime = 0;
    winSound.play();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        catchDigit();
    }
});

buildReel();
startReel();
newGame();
modalBackdrop.classList.add('show');