// Game menu handler with improved initialization
export function initGameMenu() {
    console.log('Game menu initialization started');

    // Get DOM elements
    const menuLinks = document.querySelectorAll('.side-menu a');
    const gameTitle = document.getElementById('gameTitle');
    const snakeGame = document.getElementById('snakeGame');
    const blackjackGame = document.getElementById('blackjackGame');

    // Verify DOM elements
    if (!snakeGame || !blackjackGame) {
        console.error('Game containers not found');
        return;
    }

    console.log('Game containers found');

    let snakeInitialized = false;
    let blackjackInitialized = false;

    // Initialize Snake game
    async function initializeSnake() {
        if (!snakeInitialized) {
            console.log('Initializing Snake game...');
            try {
                const snakeModule = await import('./snake.js');
                if (typeof snakeModule.initGame === 'function') {
                    snakeModule.initGame();
                    snakeInitialized = true;
                    console.log('Snake game initialized successfully');
                }
            } catch (error) {
                console.error('Error loading Snake game:', error);
                if (snakeGame) {
                    snakeGame.innerHTML = '<p class="error-message">Failed to load Snake game. Please refresh the page.</p>';
                }
            }
        }
    }

    // Initialize Blackjack game
    async function initializeBlackjack() {
        if (!blackjackInitialized) {
            console.log('Initializing Blackjack game...');
            try {
                const blackjackModule = await import('./casinoBlackjack.js');
                if (typeof blackjackModule.initBlackjackGame === 'function') {
                    blackjackModule.initBlackjackGame();
                    blackjackInitialized = true;
                    console.log('Blackjack game initialized successfully');
                }
            } catch (error) {
                console.error('Error loading Blackjack game:', error);
                if (blackjackGame) {
                    blackjackGame.innerHTML = '<p class="error-message">Failed to load Blackjack game. Please refresh the page.</p>';
                }
            }
        }
    }

    // Hide all games
    function hideAllGames() {
        console.log('Hiding all games');
        if (snakeGame) snakeGame.style.display = 'none';
        if (blackjackGame) {
            blackjackGame.style.display = 'none';
            blackjackGame.classList.remove('active');
        }
    }

    // Show specific game
    async function showGame(gameName) {
        console.log(`Showing game: ${gameName}`);
        hideAllGames();

        switch (gameName) {
            case 'snake':
                await initializeSnake();
                if (snakeGame) {
                    snakeGame.style.display = 'block';
                    // Reset snake game if needed
                    const resetButton = document.getElementById('resetButton');
                    if (resetButton) {
                        resetButton.click();
                    }
                }
                break;

            case 'blackjack':
                await initializeBlackjack();
                if (blackjackGame) {
                    blackjackGame.style.display = 'block';
                    blackjackGame.classList.add('active');
                }
                break;

            default:
                console.warn(`Unknown game: ${gameName}`);
                break;
        }
    }

    // Set up menu click handlers
    console.log('Setting up menu handlers');
    menuLinks.forEach(link => {
        link.addEventListener('click', async function (e) {
            e.preventDefault();

            // Remove active class from all links
            menuLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            const gameName = this.getAttribute('data-game');
            console.log(`Menu item clicked: ${gameName}`);

            if (gameTitle) {
                gameTitle.textContent = this.textContent;
            }

            await showGame(gameName);
        });
    });

    // Initialize game based on URL hash or default to Snake
    const hash = window.location.hash.slice(1); // Remove #
    const validGames = ['snake', 'blackjack'];
    const initialGame = validGames.includes(hash) ? hash : 'snake';

    console.log(`Initializing with game: ${initialGame}`);

    // Update active menu item
    menuLinks.forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.side-menu a[data-game="${initialGame}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        if (gameTitle) gameTitle.textContent = activeLink.textContent;
    }

    showGame(initialGame).then(() => {
        console.log(`${initialGame} initialized as start game`);
    }).catch(error => {
        console.error(`Error initializing start game (${initialGame}):`, error);
    });
}