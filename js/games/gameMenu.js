// Game menu handler
export function initGameMenu() {
    const menuLinks = document.querySelectorAll('.side-menu a');
    const gameTitle = document.getElementById('gameTitle');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            gameTitle.textContent = this.textContent;
            // Here we can add logic to load different games
            const gameId = this.getAttribute('href').substring(1); // Remove the # from href
            loadGame(gameId);
        });
    });
}

function loadGame(gameId) {
    // This function can be expanded to load different games
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    // For now, we only have the snake game
    if (gameId === 'snake') {
        gameContainer.style.display = 'block';
    } else {
        gameContainer.style.display = 'none';
    }
}