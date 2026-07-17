# crack the code

demo: https://crack-the-code-chi.vercel.app/

crack the code is a code-breaking game where you try to guess the secret 4- digit code. you get 6 attempts to do so in order to win. past that, you can try till you guess the code correctly. 

# how to play 
the game generates a random 4 digit no. that you have to guess.
- pick a digit my pressing the `space` key when the pointer lands on the number you want to guess
- fill all the 4 slots to submit a guess
- if the digit turns green, its the correct digit in the correct position, if not the digit is incorrect or in the incorrect position
- you get 6 attempts to crack the code in order to win. past that, you can try till you get it correct

## features
- a spinning? reel to select your guesses from
- a random 4-digit code you have to guess
- a log of your previous guesses
- green and gray color feedback to indicate if the right digit is in the right spot
- win and lose screens
- how to play instructions
- uses only onekey to play


## how to run
clone the repo: 

```
git clone https://github.com/Hiba-Malkan/crack-the-code.git
cd crack-the-code
```

then run: 
```
python3 -m http.server 8000
```

and visit: 

```
localhost:8000
```
or open index.html directly in your browser

## tech stack
- html
- css
- js

## ai usage
used copilot for minor css fixes

---
### written: fri, 17 july
made for onekey