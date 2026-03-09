// DOM elements
const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const overGameModal = document.querySelector(".game-over");
const reStartButton = document.querySelector(".btn-restart");
const mobileControlebtn = document.querySelector(".controls-btns");
const mobileControleKey = document.querySelectorAll(".mobile-key");

// score elements
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector(".score");
const timeElement = document.querySelector(".time");
const finalScore = document.querySelector("#final-score");
const finalTime = document.querySelector("#final-time");
const eatenApple = document.querySelector(".apples");

// sounds
const eatSound = new Audio("./music/eat.mp3");
const gameOverSound = new Audio("./music/gameover.mp3");

// grid settings
const blockHeight = 30;
const blockWidth = 30;

// game state
let hightScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;

highScoreElement.innerText = hightScore;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

let intervalId = null;
let timerInterval = null;
let speed = 300;
const blocks = [];
let snake = [
  { x: 1, y: 5 },
  { x: 1, y: 4 },
  { x: 1, y: 3 },
];
let nextDirection = "right";
let currentDirection = "right";

let food = generateFood();

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );

  return newFood;
}

function createBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement("div");
      block.classList.add("block");
      board.appendChild(block);
      blocks[`${row} - ${col}`] = block;
    }
  }
}
createBoard();

// render function
function render() {
  let head = null;

  blocks[`${food.x} - ${food.y}`].classList.add("food");
  // Head position with nextDirection condition
  if (nextDirection === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (nextDirection === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (nextDirection === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (nextDirection === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  // Wall collision
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    clearInterval(timerInterval);
    gameOverSound.play();

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    overGameModal.style.display = "flex";
    return;
  }

  // Self collision
  const isSelfCollision = snake.some(
    (segment) => segment.x === head.x && segment.y === head.y,
  );
  // Self collision condition
  if (isSelfCollision) {
    clearInterval(intervalId);
    clearInterval(timerInterval);

    gameOverSound.play();

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    overGameModal.style.display = "flex";
    return;
  }

  //    Food consume logic
  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x} - ${food.y}`].classList.remove("food");
    food = generateFood();
    blocks[`${food.x} - ${food.y}`].classList.add("food");
    snake.unshift(head);

    eatSound.currentTime = 0;
    eatSound.play();

    score += 10;
    scoreElement.innerText = score;
    finalScore.innerText = score;
    eatenApple.innerText = score / 10;

    if (score > hightScore) {
      hightScore = score;
      localStorage.setItem("highScore", hightScore);
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.remove("fill", "head");
  });
  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.add("fill");
  });

  function makeHeadEye() {
    const headBlock = blocks[`${snake[0].x} - ${snake[0].y}`];

    headBlock.classList.add("head");

    const rotations = {
      up: "rotate(0deg)",
      right: "rotate(90deg)",
      down: "rotate(180deg)",
      left: "rotate(-90deg)",
    };

    headBlock.style.transform = rotations[nextDirection];
  }
  makeHeadEye();
}

function timeInervalfn() {
  timerInterval = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);

    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }

    time = `${min}-${sec}`;
    timeElement.innerText = time;
    finalTime.innerText = time;
  }, 1000);
}

startButton.addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, speed);
  timeInervalfn();
});

reStartButton.addEventListener("click", reStartGame);

function reStartGame() {
  clearInterval(intervalId);
  clearInterval(timerInterval);

  blocks[`${food.x} - ${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.remove("fill", "head");
  });
  timeInervalfn();
  score = 0;
  time = `00-00`;
  scoreElement.innerText = score;
  timeElement.innerText = time;
  finalTime.innerText = time;
  highScoreElement.innerText = hightScore;
  finalScore.innerText = score;
  eatenApple.innerText = score / 10;

  modal.style.display = "none";
  nextDirection = "down";
  let snake = [
  { x: 1, y: 5 },
  { x: 1, y: 4 },
  { x: 1, y: 3 },
];
  food = generateFood();
  intervalId = setInterval(() => {
    render();
  }, speed);
}

// Find nextDirection as per Key Pressed
addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    if (nextDirection !== "up") nextDirection = "down";
  } else if (event.key === "ArrowRight") {
    if (nextDirection !== "left") nextDirection = "right";
  } else if (event.key === "ArrowUp") {
    if (nextDirection !== "down") nextDirection = "up";
  } else if (event.key === "ArrowLeft") {
    if (nextDirection !== "right") nextDirection = "left";
  }
});

function mobileControles() {
  if (board.clientWidth < 400) {
    mobileControlebtn.style.display = "flex";
  } else mobileControlebtn.style.display = "none";

  mobileControleKey.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      if (e.target.id === "up") nextDirection = "up";
      else if (e.target.id === "down") nextDirection = "down";
      else if (e.target.id === "left") nextDirection = "left";
      else if (e.target.id === "right") nextDirection = "right";
    });
  });
}
mobileControles();


