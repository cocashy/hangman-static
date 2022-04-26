OVERLAP_SIGNS = ["〇", "×", "△", "□", "◇", "▽"];

let game;
window.onload = () => {
  game = new Game();
}

class Game {
  constructor() {
    this.timer = new Timer();
    this.isInPlay = false;
    this.isOver = false;

    this.answer = wordList[Math.floor(Math.random() * wordList.length)];
    this.noMatchList = [];

    this.gameBoard = document.getElementById("game-board");
    this.displayRow = document.getElementById("display-row");
    this.noMatchRow = document.getElementById("no-match-row");
    this.entryBox = document.getElementById("entry-box");
    this.keyBoard = document.getElementById("keyboard");
    this.startButton = document.getElementById("start-button");
    this.reloadButton = document.getElementById("reload-button");
    this.searchButton = document.getElementById("search-button");

    this.createBoard();
    this.keyBoard.onclick = this.adaptKeyboard;
    document.onkeydown = this.acceptKey.bind(this);
    this.startButton.onclick = this.start.bind(this);
    this.reloadButton.onclick = this.reload.bind(this);
    this.searchButton.onclick = this.search.bind(this);
  }

  start() {
    this.timer.start();
    this.isInPlay = true;
    this.startButton.style.display = "none";
    this.gameBoard.style.visibility = "visible";
  }

  createBoard() {
    const overlapRow = document.getElementById("overlap-row");
    const overlapList = [...this.answer].filter((v, i, array) => !(array.indexOf(v) == i));

    for (let letter of this.answer) {
      let displayBox = document.createElement("div");
      displayBox.className = "letter-box";
      this.displayRow.appendChild(displayBox);

      let overlapBox = document.createElement("div");
      overlapBox.className = "letter-box";
      if (overlapList.includes(letter)) {
        overlapBox.innerText = OVERLAP_SIGNS[overlapList.indexOf(letter)];
      }
      overlapRow.appendChild(overlapBox);
    }
  }

  adaptKeyboard(e) {
    const input = e.target.textContent;

    let key;
    if (input === "Del") {
      key = "Backspace"
    } else {
      key = input;
    }

    const keyDownEvent = new KeyboardEvent("keydown", {
      "key": key
    });

    document.dispatchEvent(keyDownEvent);
  }

  acceptKey(e) {
    if (e.key == " " && !this.isInPlay) {
      this.start.bind(this)();
    }

    if (e.key == " " && this.isOver) {
      this.reload.bind(this)();
    }

    if (!this.isInPlay) return;

    if (e.key.match("^[a-zA-Z]{1}$")) {
      this.entryBox.innerText = e.key.toUpperCase();
    } else if (e.key == "Backspace") {
      this.entryBox.innerText = "";
    } else if (e.key == "Enter") {
      this.checkKey(this.entryBox.innerText);
      this.checkStatus();
      this.entryBox.innerText = "";
    }
  }

  checkKey(key) {
    if (this.answer.includes(key)) {
      this.fillByKey(key);
    } else if (!this.noMatchList.includes(key)) {
      const box = document.createElement("div");
      box.className = "letter-box";
      box.innerText = key;
      this.noMatchRow.appendChild(box);
      this.noMatchList.push(key);
    }
  }

  checkStatus() {
    const isCompleted = [...this.answer].every((letter, i) => {
      return this.displayRow.children[i].innerText == letter;
    });

    if (this.noMatchList.length >= 7 || isCompleted) {
      this.isOver = true;
      this.timer.stop();
      this.fillAll();
      this.reloadButton.style.visibility = "visible";
      this.searchButton.style.visibility = "visible";
    }
  }

  fillByKey(key) {
    [...this.answer].forEach((letter, i) => {
      if (letter != key) return;
      this.displayRow.children[i].innerText = letter;
    });
  }

  fillAll() {
    [...this.answer].forEach((letter, i) => {
      this.displayRow.children[i].innerText = letter;
    });
  }

  reload() {
    location.reload();
  }

  search() {
    window.open("https://www.google.com/search?q=" + this.answer.toLowerCase());
  }
}

class Timer {
  constructor() {
    this.isActive = false;
  }

  start() {
    this.isActive = true;
    this.startTime = Date.now();
    this.countUp();
  }

  countUp() {
    const nowTime = new Date(Date.now() - this.startTime);
    const min = String(nowTime.getMinutes()).padStart(2, 0);
    const sec = String(nowTime.getSeconds()).padStart(2, 0);
    const ms = String(nowTime.getMilliseconds()).padStart(3, 0);
    document.getElementById("timer").innerText = `${min}:${sec}.${ms}`;
    if (this.isActive) {
      setTimeout(this.countUp.bind(this), 10);
    }
  }

  stop() {
    this.isActive = false;
  }
}
