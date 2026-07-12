const CODE_LEN = 4; 
const MAX_ATTEMPTS = 6;
const DIGIT_DURATION = 120;
let secret = [];
let attempts = [];
let currentGuess = [];
let gameOver = false;
let startTime = null; 

const reelEl = document.getElementById('reel');
const slotsEl = document.getElementById('slots');
const historyEl = document.getElementById('history');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

function buildReel() {
    reelEl.innerHTML = '';
    for (let i = 0; i < 70; i++) {
        const d = document.createElement('div');
        d.className = 'digit';
        d.textContent = i % 10;
        reelEl.appendChild(d);
    }
}

function newSecret() {
    const pool = [0,1,2,3,4,5,6,7,8,9];
    length = pool.length - 1;
    for (let i = length; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    secret = pool.slice(0, CODE_LEN);
}

function newGame() {
    secret = newSecret(); 
    attempts = [];
    currentGuess = [];
    gameOver = false;
    renderHistory();
    renderSlots();
    updateStatus();
    startTime = performance.now();
    restartBtn.style.display = 'none';
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
            c.textContent = d;
            row.appendChild(c);
        });
        historyEl.appendChild(row);
    });
    history.El.scrollTop = historyEl.scrollHeight;
}

function renderSlots() {
    slotsEl.El.innerHTML = '';
    for (let i = 0; i < CODE_LEN; i++) {
        const s = document.createElement('div');
        if (i < currentGuess.length) {
            s.className = 'slot';
            s.textContent = currentGuess[i];
        }
        else {
            s.className = 'slot empty';
            s.textContent = '';
        }
        slotsEl.appendChild(s);
    }
}

function updateStatus(msg) {
    if (msg) {
        statusEl.textContent = msg;
        return;
    }
    const left = MAX_ATTEMPTS - attempts.length;
    if (!gameOver) {
        statusEl.textContent = 'Guesses left: ' + left;

    }
    else {
        statusEl.textContent = 'Game Over. Secret: ' + secret.join('');
    }
}

function currentDigitIndex(elapsed) {
    return Math.floor(elapsed / DIGIT_DURATION);

}

function catchDigit() {
    if (gameOver || currentGuess.length >= CODE_LEN) {
        return;
    }
    const elapsed = performance.now() - startTime;
    const idx = currentDigitIndex(elapsed);
    const digit = idx % 10;
    currentGuess.push(digit);
    renderSlots();
    if (currentGuess.length === CODE_LEN) {
        submitGuess();
    }
}

function submitGuess() {
    const feedback = evaluate(currentGuess);
    attempts.push({ guess: currentGuess.slice(), feedback });
    renderHistory();
    const won = feedback.every(f => f === 'green');
    if (won) {
        gameOver = true;
        updateStatus('You won! Code: ' + secret.join('') + ' in ' + attempts.length + ' guesses.');
        restartBtn.style.display = 'inline-block';
    }
    else if (attempts.length === MAX_ATTEMPTS) {
        gameOver = true;
        updateStatus('Out of guesses. Code was ' + secret.join('') + '.');
        restartBtn.style.display = 'inline-block';
    }
    else {
        currentGuess = [];
        renderSlots();
        updateStatus();
    }

}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        catchDigit();
    }
});

restartBtn.addEventListener('click', newGame);
buildReel();
newGame();