const random = (n) => Math.floor(Math.random() * n);
const answer = wordList[random(wordList.length)];

let startTime;
let gameStatus = "await";
const overlapSign = ['〇', '×', '△', '□', '◇', '▽'];
const overlapList = [...answer].filter((v, i, array) => !(array.indexOf(v) == i));
const noMatchList = [];

let gameBoard;
let displayRow;
let overlapRow;
let entryBox;

const timer = document.getElementById('timer');
const noMatchRow = document.getElementById('no-match-row');
const startButton = document.getElementById('start-button');
const searchButton = document.getElementById("search-button");

const initBoard = () => {
  gameBoard = document.getElementById("display-row");
  displayRow = document.getElementById("display-row");
  for (let letter of answer) {
    let box = document.createElement("div");
    box.className = "letter-box";
    displayRow.appendChild(box);
  }
  overlapRow = document.getElementById("overlap-row");
  for (let letter of answer) {
    let box = document.createElement("div");
    box.className = "letter-box";
    if (overlapList.includes(letter)) {
      box.innerText = overlapSign[overlapList.indexOf(letter)];
    }
    overlapRow.appendChild(box);
  }
  const entryRow = document.getElementById("entry-row");
  entryBox = document.createElement("div");
  entryBox.className = "letter-box";
  entryRow.appendChild(entryBox);
}

const initKeyBoard = () => {
  const keyboard = document.getElementById("keyboard");
  keyboard.addEventListener("click", (e) => {
    const target = e.target;
    let key = target.textContent;
    if (key === "Del") {
      key = "Backspace"
    }
    const keyDownEvent = new KeyboardEvent("keydown", {
      'key': key
    });
    document.dispatchEvent(keyDownEvent);
  });
}

window.onload = () => {
  initBoard();
  initKeyBoard();
}

const inputKey = (key) => {
  if (answer.includes(key)) {
    [...answer].forEach((letter, i) => {
      if (letter != key) return;
      displayRow.children[i].innerText = letter;
    });
  } else if (!noMatchList.includes(key)) {
    noMatchList.push(key);
    const box = document.createElement("div");
    box.className = "letter-box";
    box.innerText = key;
    noMatchRow.appendChild(box);
  }
}

searchButton.onclick = () => {
  window.open("https://www.google.com/search?q=" + answer.toLowerCase());
}

const checkGameStatus = () => {
  const isCompleted = [...answer].every((letter, i) => {
    return displayRow.children[i].innerText == letter;
  });
  if (noMatchList.length >= 7 || isCompleted) {
    gameStatus = "over";
    [...answer].forEach((letter, i) => {
      displayRow.children[i].innerText = letter;
    });
    searchButton.style.visibility = "visible";
  }
}

document.addEventListener('keydown', (e) => {
  const pressedKey = e.key;
  if (gameStatus == "await") {
    if (pressedKey == ' ' && gameStatus == "await") {
      startGame();
    }
  } else if (gameStatus == "playing") {
    if (pressedKey.match('^[a-zA-Z]{1}$')) {
      entryBox.innerText = pressedKey.toUpperCase();
    } else if (pressedKey == 'Backspace') {
      entryBox.innerText = '';
    } else if (pressedKey == 'Enter') {
      inputKey(entryBox.innerText);
      checkGameStatus();
      entryBox.innerText = '';
    }
  } else if (gameStatus == "over") {

  } else {

  }
});

const countUp = () => {
  const nowTime = new Date(Date.now() - startTime);
  const min = String(nowTime.getMinutes()).padStart(2, 0);
  const sec = String(nowTime.getSeconds()).padStart(2, 0);
  const ms = String(nowTime.getMilliseconds()).padStart(3, 0);
  timer.innerText = `${min}:${sec}.${ms}`;
  if (gameStatus != "over") {
    setTimeout(countUp, 10);
  }
}

const startGame = () => {
  gameStatus = "playing";
  document.getElementById("game-board").style.visibility = "visible";
  startButton.style.visibility = "hidden";
  startTime = Date.now();
  countUp();
}

startButton.addEventListener('click', startGame);
