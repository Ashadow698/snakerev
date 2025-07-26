const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = randomPosition();
let direction = { x: 0, y: 0 };
let gameOver = false;
let started = false;

document.addEventListener('keydown', (e) => {
  started = true;
  if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
});

function gameLoop() {
  if (gameOver) return showGameOver();

  setTimeout(() => {
    if (started) update();
    draw();
    requestAnimationFrame(gameLoop);
  }, 100);
}

function update() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= tileCount || head.y >= tileCount ||
    snake.some(part => part.x === head.x && part.y === head.y)
  ) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    let newHead;
    let tries = 0;
    do {
      newHead = randomPosition();
      tries++;
    } while (
      snake.some(part => part.x === newHead.x && part.y === newHead.y) &&
      tries < 100
    );
    snake[0] = newHead;
    food = randomPosition();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = '#0f0';
  for (const part of snake) {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
  }

  // Food
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

  // Start instruction
  if (!started) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Press Arrow Key to Start', 70, 200);
  }
}

function randomPosition() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function showGameOver() {
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText('Game Over', 110, 200);
}

gameLoop();
