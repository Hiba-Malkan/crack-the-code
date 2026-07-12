const CODE_LEN = 4; 
let secret = '';
let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

for (let i = 0; i < CODE_LEN; i++) {
  let index = Math.floor(Math.random() * digits.length);
  secret += digits.splice(index, 1);
}

let currentGuess = '';
let running = true;
let value = 0;
const digitEl = document.getElementById('digit');
const guessEl = document.getElementById('guess');
const statusEl = document.getElementById('status');

setInterval(() => {
    if (!running) {
        return;
    }

    value = (value + 1) % 10;
    digitEl.textContent = value;
}, 120);

document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || !running) {
        return;
    }
    e.preventDefault();
    currentGuess += value;
    guessEl.textContent = 'Guess: ' + currentGuess.padEnd(CODE_LEN, '-');
    if (currentGuess.length === CODE_LEN) {
        running = false;
        if (currentGuess === secret) {
            statusEl.textContent = "You win!"; 
            statusEl.style.color = "green";
        }
        else {
            statusEl.textContent = "You lose! The secret code was: " + secret;
            statusEl.style.color = "red";
        }
    }
});


