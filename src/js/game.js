import { WORDS, KEYBOARD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game");
const logoH1 = document.getElementById("logo");

let triesLeft;
let winCount;

const createPlaceholdersHTML = () => {
  const word = sessionStorage.getItem("word");
  const wordArray = Array.from(word);
  const placeholderHTML = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter_${i}"  class="letter">_</h1>`,
    ""
  );

  return `<div id="placeholders" class="placeholders-wrapper">${placeholderHTML}</div>`;
};

const createKeyBoard = () => {
  const keyBoard = document.createElement("div");
  keyBoard.classList.add("keyBoard");
  keyBoard.id = "keyBoard";

  const keyBoardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
    return (
      acc +
      `<button class="button-primary keyBoard-button" id="${curr}">${curr}</button>`
    );
  }, "");

  keyBoard.innerHTML = keyBoardHTML;
  return keyBoard;
};

const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "images/hg-0.png";
  image.alt = "hangman image";
  image.classList.add("hangman-img");
  image.id = "hangman-img";

  return image;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem("word");
  const inputLetter = letter.toLowerCase();

  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById("tries-left");

    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById("hangman-img");
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame("lose");
    }
  } else {
    const wordArray = Array.from(word);
    wordArray.forEach((currentLetter, i) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame("win");
          return;
        }
        document.getElementById(`letter_${i}`).innerText =
          inputLetter.toUpperCase();
      }
    });
  }
};

const stopGame = (status) => {
  document.getElementById("placeholders").remove();
  document.getElementById("tries").remove();
  document.getElementById("keyBoard").remove();
  document.getElementById("quit").remove();

  const word = sessionStorage.getItem("word");

  if (status === "win") {
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header win">You won!</h2>';
  } else if (status === "lose") {
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header lose">You lost :(</h2>';
  }else if(status === "quit"){
    logoH1.classList.remove("logo-sm")
    document.getElementById("hangman-img").remove();
  }
  document.getElementById(
    "game"
  ).innerHTML += `<p>The word was: <span class="result-word">${word} </span></p> <button id="play-again" class="button-primary px-5 py-2 mt-5 mr-0">Play again</button>`;
  document.getElementById("play-again").onclick = startGame;
};

export const startGame = () => {
  triesLeft = 10;
  winCount = 0;

  logoH1.classList.add("logo-sm");
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);

  gameDiv.innerHTML = createPlaceholdersHTML();

  gameDiv.innerHTML +=
    '<p id="tries" class="mt-2">TRIES LELFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>';

  const keyBoardDiv = createKeyBoard();
  keyBoardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "button") {
      event.target.disabled = true;
      checkLetter(event.target.id);
    }
  });

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(keyBoardDiv);

  gameDiv.insertAdjacentHTML("beforeend", '<button id="quit" class="button-secondary px-2 py-1 mt-4">Quit</button>')
  document.getElementById("quit").onclick = () => {
       const isSure = confirm("Are you sure you want to quit and lose progress?")
       if(isSure){
              stopGame("quit")
       }
       
  }
};
// ЧЕРТ ВОЗЬМИ Я ЗАЕБАЛСЯ