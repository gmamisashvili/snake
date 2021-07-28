class Snake {
  numberRegex = /\d+/;
  moveInterval;
  movingObj = {
    right: 0,
    bottom: 1,
    left: 2,
    up: 3,
    none: 4
  };
  movignDir;
  oldPosition;
  moveByNumber = 50; // px
  foodPosition;
  speedInterval = 200;

  constructor(element) {
    this.listenButton();
    this.adjustFieldSize();
    this.snakeElement = element;
    this.spawnRandomBlock();
    document.addEventListener("keydown", (event) => {
      this.detectMove(event.keyCode);
    });
  }

  listenButton() {
    document.getElementById("play-button").addEventListener("click", () => {
      this.hideModal();
    })
  };



  adjustFieldSize() {
    const field = document.getElementById('field')
    const fieldWidth = document.getElementById("field").clientWidth;
    const fieldHeight = document.getElementById("field").clientHeight;
    this.fieldWidth = Math.floor(fieldWidth - (fieldWidth % this.moveByNumber));
    this.fieldHeight = Math.floor(fieldHeight - (fieldHeight % this.moveByNumber));
    field.style.height = `${this.fieldHeight}px`;
    field.style.width = `${this.fieldWidth}px`;
  }

  checkRestrictedMove(movignDir, dir) {
    if (movignDir === this.movingObj['none']) {
      return true;
    }
    if (movignDir !== dir && movignDir - 2 !== dir && movignDir + 2 !== dir) {
      return true;
    }
  }

  resetSnake() {
    const allBlock = this.getAllBlock();

    this.snakeElement.style.transform = 'translate(0, 0)'
    document.getElementById('score').innerText = 0;
    let i = allBlock.length -1;
    while (i > 0) {
      allBlock[i].parentNode.removeChild(allBlock[i])
      i--;
    }
    this.movignDir = this.movingObj['none'];
    this.snakeElement.classList.remove('animate-block');
  }

  hideModal() {
    document.getElementById('modal').style.visibility = 'hidden'
    this.resetSnake();
  }

  showModal() {
    document.getElementById('modal').style.visibility = 'visible'
  }

  detectMove(keyCode) {
    switch (keyCode) {
      case 39:
        this.keyHandler(this.moveRight.bind(this), this.movingObj["left"]);
        break;
      case 37:
        this.keyHandler(this.moveLeft.bind(this), this.movingObj["right"]);
        break;
      case 40:
        this.keyHandler(this.moveDown.bind(this), this.movingObj["bottom"]);
        break;
      case 38:
        this.keyHandler(this.moveUp.bind(this), this.movingObj["up"]);
        break;
      default:
        break;
    }
  }

  keyHandler(moveFunc, direction) {
    if (this.checkRestrictedMove(this.movignDir, direction)) {
      if (this.moveInterval) {
        clearInterval(this.moveInterval);
      }
      moveFunc();
      this.moveInterval = setInterval(function () {
        moveFunc();
      }, this.speedInterval);
    }
  }

  checkWallHit(movedX, movedY) {
    movedX = +movedX;
    movedY = +movedY
    if (
      movedX < 0 ||
      movedX + (+this.snakeElement.clientWidth) > this.fieldWidth
    ) {
      this.snakeElement.classList += ' animate-block'
      this.showModal();
      clearInterval(this.moveInterval);
    } else if (
      movedY + (+this.snakeElement.clientHeight) > this.fieldHeight ||
      movedY < 0
    ) {
      this.snakeElement.classList += ' animate-block'
      this.showModal();
      clearInterval(this.moveInterval);
    }
  }

  checkCollision() {
    const allBlock = this.getAllBlock();
    const eachBlockPosition = [];

    for (let i = 1; i < allBlock.length; i++) {
      const currChildPosX = allBlock[i].style.transform
        .split(",")[0]
        ?.match(this.numberRegex)?.[0];
      const currChildPosY = allBlock[i].style.transform
        .split(",")[1]
        ?.match(this.numberRegex)?.[0];
      const currChildPos = `translate(${currChildPosX}px, ${currChildPosY}px)`;
      eachBlockPosition.push(currChildPos);
    }
    if (eachBlockPosition.includes(allBlock[0].style.transform)) {
      this.snakeElement.classList += ' animate-block'
      this.showModal();
      clearInterval(this.moveInterval);
    }
  }

  moveDown(px = this.moveByNumber) {
    this.movignDir = this.movingObj["bottom"];
    const snakeTranslate = this.snakeElement.style;
    if (!snakeTranslate.transform) {
      snakeTranslate.transform = `translate(0, ${px}px)`;
    } else {
      const movedXPx = snakeTranslate.transform
        .split(",")[0]
        .match(this.numberRegex)[0];
      const movedYPx = snakeTranslate.transform
        .split(",")[1]
        .match(this.numberRegex)[0];
      const toMove = Number(movedYPx) + px;
      snakeTranslate.transform = `translate(${movedXPx}px, ${toMove}px)`;
      this.checkWallHit(movedXPx, toMove);
      this.oldPosition = `translate(${movedXPx}px, ${movedYPx}px)`;
      this.moveTailBlocks(this.oldPosition);
      this.checkCollision();
      this.checkFood();
    }
  }

  moveUp(px = this.moveByNumber) {
    this.movignDir = this.movingObj["up"];
    const snakeTranslate = this.snakeElement.style;
    if (!snakeTranslate.transform) {
      alert("U lost");
    } else {
      const movedXPx = snakeTranslate.transform
        .split(",")[0]
        .match(this.numberRegex)[0];
      const movedYPx = snakeTranslate.transform
        .split(",")[1]
        .match(this.numberRegex)[0];
      const toMove = Number(movedYPx) - px;
      snakeTranslate.transform = `translate(${movedXPx}px, ${toMove}px)`;
      this.checkWallHit(movedXPx, toMove);
      this.oldPosition = `translate(${movedXPx}px, ${movedYPx}px)`;
      this.moveTailBlocks(this.oldPosition);
      this.checkCollision()
      this.checkFood();
    }
  }

  moveRight(px = this.moveByNumber) {
    this.movignDir = this.movingObj["left"];
    const snakeTranslate = this.snakeElement.style;
    if (!snakeTranslate.transform) {
      snakeTranslate.transform = `translate(${px}px, 0px)`;
    } else {
      const movedXPx = snakeTranslate.transform
        .split(",")[0]
        .match(this.numberRegex)[0];
      const movedYPx = snakeTranslate.transform
        .split(",")[1]
        .match(this.numberRegex)[0];
      const toMove = Number(movedXPx) + px;
      snakeTranslate.transform = `translate(${toMove}px, ${movedYPx}px)`;
      this.checkWallHit(toMove, movedYPx);
      this.oldPosition = `translate(${movedXPx}px, ${movedYPx}px)`;
      this.moveTailBlocks(this.oldPosition);
      this.checkCollision();
      this.checkFood();
    }
  }

  moveLeft(px = this.moveByNumber) {
    this.movignDir = this.movingObj["right"];
    const snakeTranslate = this.snakeElement.style;
    if (!snakeTranslate.transform) {
      alert("U lost");
    } else {
      const movedXPx = snakeTranslate.transform
        .split(",")[0]
        .match(this.numberRegex)[0];
      const movedYPx = snakeTranslate.transform
        .split(",")[1]
        .match(this.numberRegex)[0];
      const toMove = Number(movedXPx) - px;
      snakeTranslate.transform = `translate(${toMove}px, ${movedYPx}px)`;
      this.checkWallHit(toMove, movedYPx);
      this.oldPosition = `translate(${movedXPx}px, ${movedYPx}px)`;
      this.moveTailBlocks(this.oldPosition);
      this.checkCollision();
      this.checkFood();
    }
  }

  moveTailBlocks() {
    const allBlock = this.getAllBlock();
    for (let i = 1; i < allBlock.length; i++) {
      const currChildPosX = allBlock[i].style.transform
        .split(",")[0]
        ?.match(this.numberRegex)?.[0];
      const currChildPosY = allBlock[i].style.transform
        .split(",")[1]
        ?.match(this.numberRegex)?.[0];
      const currChildPos = `translate(${currChildPosX}px, ${currChildPosY}px)`;
      allBlock[i].style.transform = this.oldPosition;
      this.oldPosition = currChildPos;
    }
  }

  addTail() {
    const allBlock = this.getAllBlock();
    const tailBlock = document.createElement("div");
    tailBlock.style.backgroundColor = "yellowgreen";
    tailBlock.classList.value = "snake";
    tailBlock.style.transform = this.oldPosition;
    allBlock[allBlock.length - 1].insertAdjacentElement("afterend", tailBlock);
  }

  spawnRandomBlock() {
    const randPosX = Math.floor((Math.random() * this.fieldWidth));
    const randPosY = Math.floor((Math.random() * this.fieldHeight));
    const realX = randPosX - (randPosX % 50)
    const realY = randPosY - (randPosY % 50)
    const randomBlock = document.createElement("div");
    randomBlock.classList.value = "food";
    randomBlock.id += 'food'
    randomBlock.style.transform = `translate(${realX}px, ${realY}px)`
    document.getElementById('field').appendChild(randomBlock);
    this.foodPosition = `translate(${realX}px, ${realY}px)`;
  }

  checkFood() {
    if (this.foodPosition === this.snakeElement.style.transform) {
      this.addTail();
      this.deleteFood();
      this.spawnRandomBlock();
      this.addScore();
    }
  }

  deleteFood() {
    const food = document.getElementById('food');
    food.parentNode.removeChild(food);
  }

  addScore() {
    const score = +document.getElementById('score').innerText
    document.getElementById('score').innerText = score + 1;
  }

  getAllBlock() {
    return document.getElementsByClassName("snake");
  }
}

const newSnake = new Snake(document.getElementById("snake"));
