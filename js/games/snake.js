// Snake game implementation
export function initGame() {
    const canvas = document.getElementById('gameBoard');
    const ctx = canvas.getContext('2d');
    const GRID_SIZE = 32;
    const CELL_SIZE = canvas.width / GRID_SIZE;

    let snake = [
        { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }
    ];
    let direction = { x: 1, y: 0 };
    let food = generateFood();
    let gameLoop = null;
    let score = 2;
    let gameStarted = false;
    let ignoreBorders = false;

    const playButton = document.getElementById('playButton');
    const resetButton = document.getElementById('resetButton');
    const speedSelect = document.getElementById('speed');
    const targetLengthSelect = document.getElementById('targetLengthSelect');
    const ignoreBordersCheckbox = document.getElementById('ignoreBorders');
    const currentLengthSpan = document.getElementById('currentLength');
    const targetLengthSpan = document.getElementById('targetLength');
    const statusDiv = document.getElementById('status');

    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= GRID_SIZE; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, canvas.height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= GRID_SIZE; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(canvas.width, y * CELL_SIZE);
            ctx.stroke();
        }

        // Draw snake
        snake.forEach((segment, index) => {
            // Head is green, body is darker green
            if (index === 0) {
                ctx.fillStyle = '#2ecc71';
            } else {
                ctx.fillStyle = '#27ae60';
            }

            // Draw rounded rectangle for snake segments
            roundedRect(
                segment.x * CELL_SIZE + 1,
                segment.y * CELL_SIZE + 1,
                CELL_SIZE - 2,
                CELL_SIZE - 2,
                CELL_SIZE / 4
            );

            // Draw eyes on head
            if (index === 0) {
                ctx.fillStyle = 'white';
                const eyeOffset = CELL_SIZE / 4;
                const eyeRadius = CELL_SIZE / 10;

                // Calculate eye positions based on direction
                const eyePositions = getEyePositions(segment, eyeOffset);

                // Draw eyes
                eyePositions.forEach(pos => {
                    // White of the eye
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, eyeRadius, 0, Math.PI * 2);
                    ctx.fill();

                    // Pupil
                    ctx.fillStyle = 'black';
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, eyeRadius / 2, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        });

        // Draw food
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(
            (food.x + 0.5) * CELL_SIZE,
            (food.y + 0.5) * CELL_SIZE,
            CELL_SIZE / 2 * 0.8,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    function getEyePositions(segment, offset) {
        const positions = [];
        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;

        if (direction.x === 1) { // Right
            positions.push(
                {x: x + CELL_SIZE - offset, y: y + CELL_SIZE / 3},
                {x: x + CELL_SIZE - offset, y: y + CELL_SIZE * 2/3}
            );
        } else if (direction.x === -1) { // Left
            positions.push(
                {x: x + offset, y: y + CELL_SIZE / 3},
                {x: x + offset, y: y + CELL_SIZE * 2/3}
            );
        } else if (direction.y === -1) { // Up
            positions.push(
                {x: x + CELL_SIZE / 3, y: y + offset},
                {x: x + CELL_SIZE * 2/3, y: y + offset}
            );
        } else { // Down
            positions.push(
                {x: x + CELL_SIZE / 3, y: y + CELL_SIZE - offset},
                {x: x + CELL_SIZE * 2/3, y: y + CELL_SIZE - offset}
            );
        }

        return positions;
    }

    function roundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
    }

    function moveSnake() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Handle border collision or wrapping
        if (ignoreBorders) {
            head.x = (head.x + GRID_SIZE) % GRID_SIZE;
            head.y = (head.y + GRID_SIZE) % GRID_SIZE;
        } else if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            gameOver();
            return;
        }

        // Check self-collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            food = generateFood();
            score++;
            currentLengthSpan.textContent = score;
            
            // Check win condition
            const targetLength = parseInt(targetLengthSelect.value);
            if (score >= targetLength) {
                gameWon();
                return;
            }
        } else {
            snake.pop();
        }

        drawGame();
    }

    function gameOver() {
        clearInterval(gameLoop);
        gameStarted = false;
        statusDiv.textContent = 'Game Over! Press Play to try again';
        playButton.textContent = 'Play';
        playButton.disabled = false;
    }

    function gameWon() {
        clearInterval(gameLoop);
        gameStarted = false;
        statusDiv.textContent = 'Congratulations! You won!';
        playButton.textContent = 'Play';
        playButton.disabled = false;
    }

    function resetGame() {
        snake = [
            { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }
        ];
        direction = { x: 1, y: 0 };
        food = generateFood();
        score = 2;
        currentLengthSpan.textContent = score;
        statusDiv.textContent = 'Press Play to start';
        drawGame();
    }

    function handleKeyPress(event) {
        if (!gameStarted) return;

        const key = event.key;
        const newDirection = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 }
        }[key];

        if (newDirection && 
            !(newDirection.x + direction.x === 0 && newDirection.y + direction.y === 0)) {
            direction = newDirection;
        }
    }

    // Event Listeners
    playButton.addEventListener('click', () => {
        if (gameStarted) {
            clearInterval(gameLoop);
            gameStarted = false;
            playButton.textContent = 'Play';
            statusDiv.textContent = 'Game Paused';
        } else {
            gameStarted = true;
            playButton.textContent = 'Pause';
            statusDiv.textContent = 'Game Running';
            const speed = parseInt(speedSelect.value);
            gameLoop = setInterval(moveSnake, speed);
        }
    });

    resetButton.addEventListener('click', () => {
        clearInterval(gameLoop);
        gameStarted = false;
        playButton.textContent = 'Play';
        resetGame();
    });

    targetLengthSelect.addEventListener('change', () => {
        targetLengthSpan.textContent = targetLengthSelect.value;
    });

    ignoreBordersCheckbox.addEventListener('change', (e) => {
        ignoreBorders = e.target.checked;
    });

    document.addEventListener('keydown', handleKeyPress);

    // Initial setup
    resetGame();
    targetLengthSpan.textContent = targetLengthSelect.value;
}