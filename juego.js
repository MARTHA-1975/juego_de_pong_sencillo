function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibuja la línea del medio
  ctx.strokeStyle = '#2ecc40';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Dibuja el marcador
  ctx.font = '48px Arial';
  ctx.fillStyle = '#2ecc40';
  ctx.textAlign = 'center';
  ctx.fillText(playerScore, canvas.width / 4, 60);
  ctx.fillText(aiScore, canvas.width * 3 / 4, 60);

  // Dibuja las paletas
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Dibuja la bola
  ctx.fillStyle = '#fff';
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}



const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

// Constantes del juego
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - 20 - PADDLE_WIDTH;
const PADDLE_SPEED = 7;
const BALL_SPEED = 6;

// Puedes ajustar la dificultad aquí:
let AI_SPEED = 4;         // Valor inicial, se modifica por la dificultad
let AI_REACTION = 30;     // Valor inicial, se modifica por la dificultad

function setDifficulty(level) {
  if (level === 'facil') {
    AI_SPEED = 3;
    AI_REACTION = 50;
  } else if (level === 'normal') {
    AI_SPEED = 5;
    AI_REACTION = 30;
  } else if (level === 'dificil') {
    AI_SPEED = 8;
    AI_REACTION = 10;
  }
}
// Estado del juego
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);

// Marcador
let playerScore = 0;
let aiScore = 0;

// Control de la paleta del jugador con el mouse
canvas.addEventListener('mousemove', function (e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Limita la paleta dentro del canvas
  if (playerY < 0) playerY = 0;
  if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// Lógica de la paleta IA
function moveAI() {
  // La IA sigue la bola (con suavizado)
  let center = aiY + PADDLE_HEIGHT / 2;
  if (center < ballY + BALL_SIZE / 2 - 10) {
    aiY += PADDLE_SPEED;
  } else if (center > ballY + BALL_SIZE / 2 + 10) {
    aiY -= PADDLE_SPEED;
  }
  // Limita la paleta dentro del canvas
  if (aiY < 0) aiY = 0;
  if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

// Movimiento y colisiones de la bola
function moveBall() {
  ballX += ballVelX;
  ballY += ballVelY;

  // Colisión con las paredes superior/inferior
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballVelY *= -1;
    ballY = Math.max(0, Math.min(ballY, canvas.height - BALL_SIZE));
  }

  // Colisión con la paleta izquierda (jugador)
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballVelX = Math.abs(ballVelX);
    // Efecto de "spin" según el lugar de impacto
    let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballVelY += hitPos * 0.1;
  }

  // Colisión con la paleta derecha (IA)
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballVelX = -Math.abs(ballVelX);
    let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballVelY += hitPos * 0.1;
  }

  // Colisión con los límites izquierdo/derecho (punto y reinicio)
  if (ballX < 0 || ballX + BALL_SIZE > canvas.width) {
    resetBall();
  }
}

// Reinicia la bola y suma puntos
function resetBall() {
  // Si la bola sale por la izquierda, punto para la IA
  if (ballX < 0) {
    aiScore++;
  }
  // Si la bola sale por la derecha, punto para el jugador
  if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
  }
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ballVelY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

// Dibuja todo en pantalla
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Línea del medio
  ctx.strokeStyle = '#2ecc40';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Marcador
  ctx.font = '48px Arial';
  ctx.fillStyle = '#2ecc40';
  ctx.textAlign = 'center';
  ctx.fillText(playerScore, canvas.width / 4, 60);
  ctx.fillText(aiScore, canvas.width * 3 / 4, 60);

  // Paletas
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Bola
  ctx.fillStyle = '#fff';
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Bucle principal del juego
let isPaused = false;
let gameRunning = false;

function startGame() {
  if (!gameRunning) {
    gameRunning = true;
    isPaused = false;
    gameLoop();
  } else {
    isPaused = false;
  }
}

function pauseGame() {
  isPaused = true;
}

function gameLoop() {
  if (!isPaused) {
    moveAI();
    moveBall();
    draw();
  }
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Inicia el juego
gameLoop();