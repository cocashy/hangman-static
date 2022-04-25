OVERLAP_SIGNS = ['〇', '×', '△', '□', '◇', '▽'];

let game;

window.onload = () => {
  game = new Game();
}

class Game {
  constructor() {
    this.answer = wordList[Math.floor(Math.random() * wordList.length)];
    this.noMatchList = [];

    this.isInPlay = false;

    this.displayRow = document.getElementById("display-row");
    this.entryBox = document.createElement("div");
    document.getElementById("start-button").onclick = this.start;
    document.onkeydown = this.acceptKey;

    this.searchButton = document.getElementById("search-button");
    this.searchButton.onclick = this.search;

    this.timer = new Timer();
    console.log(this.timer)
    this.createBoard();
    document.getElementById("keyboard").onclick = this.adaptKeyboard;
  }

  start() {
    this.timer;
    console.log(this.timer)
    this.isInPlay = true;
    document.getElementById("start-button").style.visibility = "hidden";
    document.getElementById("game-board").style.visibility = "visible";
  }

  createBoard() {
    for (let letter of this.answer) {
      let box = document.createElement("div");
      box.className = "letter-box";
      this.displayRow.appendChild(box);
    }

    const overlapRow = document.getElementById("overlap-row");
    const overlapList = [...this.answer].filter((v, i, array) => !(array.indexOf(v) == i));
    for (let letter of this.answer) {
      let box = document.createElement("div");
      box.className = "letter-box";
      if (overlapList.includes(letter)) {
        box.innerText = OVERLAP_SIGNS[overlapList.indexOf(letter)];
      }
      overlapRow.appendChild(box);
    }

    this.entryBox.className = "letter-box";
    const entryRow = document.getElementById("entry-row");
    entryRow.appendChild(this.entryBox);
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
      'key': key
    });
    document.dispatchEvent(keyDownEvent);
  }

  acceptKey(e) {
    if (!this.isActive && e.key == " ") {
      this.start();
    }

    if (!this.isActive) return;

    const text = this.entryBox.innerText;
    if (e.key.match('^[a-zA-Z]{1}$')) {
      text = e.key.toUpperCase();
    } else if (e.key == 'Backspace') {
      text = '';
    } else if (e.key == 'Enter') {
      text = '';
      this.checkKey(text);
      this.checkStatus();
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
      this.timer.stop();
      this.fillAll();
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

  search() {
    const url = "https://www.google.com/search?q=" + this.answer.toLowerCase();
    window.open(url);
  }
}

class Timer {
  constructor() {
    this.startTime;
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
      setTimeout(this.countUp, 10);
    }
  }

  stop() {
    this.isActive = false;
  }
}
