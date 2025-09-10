const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

// Player paddle
const player = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'WHITE',
    score: 0
};

// Computer paddle
const com = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'WHITE',
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: 'WHITE'
};

// Draw rectangle (for paddles)
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw circle (for ball)
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw text (for score)
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '75px fantasy';
    ctx.fillText(text, x, y);
}

// Draw net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, 'WHITE');
    }
}

// Render the game
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'BLACK');

    // Draw the net
    drawNet();

    // Draw the scores
    drawText(player.score, canvas.width / 4, canvas.height / 5, 'WHITE');
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, 'WHITE');

    // Draw the paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Control the player's paddle
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
}

// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
}

// Update game logic
function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Simple AI for computer paddle
    let comLevel = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * comLevel;


    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let p = (ball.x < canvas.width / 2) ? player : com;

    if (collision(ball, p)) {
        // Find where the ball hit the paddle
        let collidePoint = (ball.y - (p.y + p.height / 2));
        collidePoint = collidePoint / (p.height / 2);

        // Calculate angle in Radian
        let angleRad = (Math.PI / 4) * collidePoint;

        // Change the X and Y velocity direction
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Increase speed every time a paddle is hit
        ball.speed += 0.5;
    }

    // Update score
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
}

// Game loop
function gameLoop() {
    update();
    render();
}

// Set interval to run gameLoop every 1000/50 seconds (50 FPS)
const framePerSecond = 50;
setInterval(gameLoop, 1000 / framePerSecond);
