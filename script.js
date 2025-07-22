const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const FLAP = -8;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_INTERVAL = 90;

let birdY = canvas.height / 2;
let birdV = 0;
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let started = false;

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(80, birdY, BIRD_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '32px Arial';
  ctx.fillText(score, canvas.width / 2 - 10, 60);
}

function drawGameOver() {
  ctx.fillStyle = '#fff';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over!', 90, 250);
  ctx.font = '24px Arial';
  ctx.fillText('스페이스바/클릭으로 재시작', 60, 300);
}

function resetGame() {
  birdY = canvas.height / 2;
  birdV = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  started = false;
}

function update() {
  if (!started) return;
  birdV += GRAVITY;
  birdY += birdV;

  // 새가 바닥이나 천장에 닿으면 게임 오버
  if (birdY + BIRD_SIZE / 2 > canvas.height || birdY - BIRD_SIZE / 2 < 0) {
    gameOver = true;
  }

  // 파이프 이동 및 충돌 체크
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= 2;
    // 충돌 체크
    if (
      80 + BIRD_SIZE / 2 > pipes[i].x &&
      80 - BIRD_SIZE / 2 < pipes[i].x + PIPE_WIDTH &&
      (birdY - BIRD_SIZE / 2 < pipes[i].top || birdY + BIRD_SIZE / 2 > pipes[i].bottom)
    ) {
      gameOver = true;
    }
    // 점수 체크
    if (!pipes[i].scored && pipes[i].x + PIPE_WIDTH < 80) {
      score++;
      pipes[i].scored = true;
    }
    // 파이프 제거
    if (pipes[i].x + PIPE_WIDTH < 0) {
      pipes.splice(i, 1);
    }
  }

  // 파이프 추가
  if (frame % PIPE_INTERVAL === 0) {
    const top = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
    pipes.push({
      x: canvas.width,
      top: top,
      bottom: top + PIPE_GAP,
      scored: false
    });
  }

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPipes();
  drawBird();
  drawScore();
  if (gameOver) drawGameOver();
}

function loop() {
  if (!gameOver) update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    if (gameOver) {
      resetGame();
    } else {
      started = true;
      birdV = FLAP;
    }
  }
});
canvas.addEventListener('mousedown', () => {
  if (gameOver) {
    resetGame();
  } else {
    started = true;
    birdV = FLAP;
  }
});

resetGame();
loop();