class Snake {
  numberRegex = /\d+/;
  moveInterval;
  movingObj = {
    right: 0,
    bottom: 1,
    left: 2,
    up: 3,
  };
  movignDir;
  oldPosition;
  moveByNumber = 40; // px

  constructor(element) {
    this.snakeElement = element;
    this.fieldWidth = document.getElementById("field").clientWidth;
    this.fieldHeight = document.getElementById("field").clientHeight;
    document.addEventListener("keydown", (event) => {
      this.detectMove(event.keyCode);
    });
  }

  checkRestrictedMove(movignDir, dir) {
    if (movignDir !== dir && movignDir - 2 !== dir && movignDir + 2 !== dir) {
      console.log(movignDir, dir);
      return true;
    }
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
      case 81:
        this.addTail();
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
      }, 100);
    }
  }

  checkWallHit(movedX, movedY) {
    if (
      +movedX < 0 ||
      +movedX + +this.snakeElement.clientWidth > this.fieldWidth
    ) {
      alert("You hit wall");
      clearInterval(this.moveInterval);
    } else if (
      +movedY + +this.snakeElement.clientHeight > this.fieldHeight ||
      movedY < 0
    ) {
      alert("You hit wall");
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
    }
  }

  moveTailBlocks() {
    const allBlock = [...document.getElementsByClassName("snake")];
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
    console.log(allBlock)
  }

  addTail() {
    const allBlock = [...document.getElementsByClassName("snake")];
    const tailBlock = document.createElement("div");
    tailBlock.style.backgroundColor = "yellowgreen";
    tailBlock.classList.value = "snake";
    tailBlock.style.transform = this.oldPosition;
    allBlock[allBlock.length - 1].insertAdjacentElement("afterend", tailBlock);
  }
}

const newSnake = new Snake(document.getElementById("snake"));
