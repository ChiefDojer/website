// DOM Elements declarations
let startScreen, gameArea, playButton, playAgainButton, hitButton, standButton;
let dealerCardsDiv, playerCardsDiv, dealerScoreSpan, playerScoreSpan;
let messageArea, gameControls, playAgainArea;

// Game State Variables
let deck = [];
let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;
let hiddenDealerCard = null;
let playerTurn = true;
let gameOver = false;

// Card Definitions
const suits = ["♥", "♦", "♣", "♠"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const cardValues = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 10, "Q": 10, "K": 10, "A": 11
};

// Game Logic Functions
function createDeck() {
    const newDeck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            newDeck.push({ suit, rank, value: cardValues[rank] });
        }
    }
    return newDeck;
}

function shuffleDeck(deckToShuffle) {
    for (let i = deckToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckToShuffle[i], deckToShuffle[j]] = [deckToShuffle[j], deckToShuffle[i]];
    }
}

function dealCard() {
    if (deck.length === 0) {
        deck = createDeck();
        shuffleDeck(deck);
    }
    return deck.pop();
}

function calculateHandScore(hand) {
    let score = 0;
    let aceCount = 0;
    for (const card of hand) {
        score += card.value;
        if (card.rank === "A") {
            aceCount++;
        }
    }
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return score;
}

function createCardElement(card, isHidden = false) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    if (isHidden) {
        cardDiv.classList.add('card-hidden');
        cardDiv.textContent = '?';
    } else {
        cardDiv.textContent = `${card.suit}${card.rank}`;
        if (card.suit === "♥" || card.suit === "♦") {
            cardDiv.classList.add('red');
        } else {
            cardDiv.classList.add('black');
        }
    }
    return cardDiv;
}

function updateUI() {
    dealerCardsDiv.innerHTML = '';
    playerCardsDiv.innerHTML = '';

    dealerCards.forEach((card, index) => {
        const isHidden = index === 0 && playerTurn && !gameOver;
        dealerCardsDiv.appendChild(createCardElement(card, isHidden));
    });

    playerCards.forEach(card => {
        playerCardsDiv.appendChild(createCardElement(card));
    });

    playerScore = calculateHandScore(playerCards);
    dealerScore = playerTurn ? calculateHandScore([dealerCards[1]]) : calculateHandScore(dealerCards);

    playerScoreSpan.textContent = playerScore;
    dealerScoreSpan.textContent = playerTurn && !gameOver ? '?' : calculateHandScore(dealerCards);

    hitButton.disabled = !playerTurn || gameOver;
    standButton.disabled = !playerTurn || gameOver;
}

function playerHit() {
    if (!playerTurn || gameOver) return;

    playerCards.push(dealCard());
    playerScore = calculateHandScore(playerCards);
    updateUI();

    if (playerScore > 21) {
        endGame("Player busts! Dealer wins.", false);
    } else if (playerScore === 21) {
        messageArea.textContent = "You have 21! Stand or Hit?";
    } else {
        messageArea.textContent = "Hit or Stand?";
    }
}

function playerStand() {
    if (!playerTurn || gameOver) return;

    playerTurn = false;
    messageArea.textContent = "Dealer's turn...";
    hitButton.disabled = true;
    standButton.disabled = true;

    dealerScore = calculateHandScore(dealerCards);
    updateUI();

    setTimeout(dealerPlay, 1000);
}

function dealerPlay() {
    dealerScore = calculateHandScore(dealerCards);

    if (dealerScore < 17) {
        messageArea.textContent = "Dealer hits...";
        dealerCards.push(dealCard());
        updateUI();
        dealerScore = calculateHandScore(dealerCards);

        if (dealerScore > 21) {
            setTimeout(() => endGame("Dealer busts! You win!", true), 1000);
        } else {
            setTimeout(dealerPlay, 1000);
        }
    } else {
        setTimeout(determineWinner, 500);
    }
}

function determineWinner() {
    playerScore = calculateHandScore(playerCards);
    dealerScore = calculateHandScore(dealerCards);

    let msg = "";
    let playerWon = false;

    if (dealerScore > 21) {
        msg = "Dealer busts! You win!";
        playerWon = true;
    } else if (playerScore > dealerScore) {
        msg = "You win!";
        playerWon = true;
    } else if (dealerScore > playerScore) {
        msg = "Dealer wins!";
        playerWon = false;
    } else {
        msg = "Push! It's a tie.";
        playerWon = null;
    }
    endGame(msg, playerWon);
}

function endGame(message, playerWon) {
    gameOver = true;
    playerTurn = false;
    messageArea.textContent = message;

    updateUI();

    hitButton.disabled = true;
    standButton.disabled = true;
    gameControls.classList.add('hidden');
    playAgainArea.classList.remove('hidden');
}

function startGame() {
    deck = createDeck();
    shuffleDeck(deck);
    playerCards = [];
    dealerCards = [];
    playerScore = 0;
    dealerScore = 0;
    playerTurn = true;
    gameOver = false;

    playerCards.push(dealCard());
    playerCards.push(dealCard());

    dealerCards.push(dealCard());
    dealerCards.push(dealCard());

    hiddenDealerCard = dealerCards[0];

    playerScore = calculateHandScore(playerCards);
    dealerScore = calculateHandScore([dealerCards[1]]);

    updateUI();
    messageArea.textContent = "Your turn. Hit or Stand?";
    gameControls.classList.remove('hidden');
    playAgainArea.classList.add('hidden');

    const playerHasBlackjack = playerScore === 21 && playerCards.length === 2;
    const dealerHasBlackjack = calculateHandScore(dealerCards) === 21 && dealerCards.length === 2;

    if (playerHasBlackjack || dealerHasBlackjack) {
        playerTurn = false;
        gameOver = true;
        setTimeout(() => {
            dealerScore = calculateHandScore(dealerCards);
            updateUI();

            if (playerHasBlackjack && dealerHasBlackjack) {
                endGame("Push! Both have Blackjack!", null);
            } else if (playerHasBlackjack) {
                endGame("Blackjack! You win!", true);
            } else {
                endGame("Dealer has Blackjack! Dealer wins.", false);
            }
        }, 1000);
    } else {
        hitButton.disabled = false;
        standButton.disabled = false;
    }
}

function initBlackjackGame() {
    startScreen = document.getElementById('startScreen');
    gameArea = document.getElementById('gameArea');
    playButton = document.getElementById('playButton');
    playAgainButton = document.getElementById('playAgainButton');
    hitButton = document.getElementById('hitButton');
    standButton = document.getElementById('standButton');
    dealerCardsDiv = document.getElementById('dealerCards');
    playerCardsDiv = document.getElementById('playerCards');
    dealerScoreSpan = document.getElementById('dealerScore');
    playerScoreSpan = document.getElementById('playerScore');
    messageArea = document.getElementById('messageArea');
    gameControls = document.getElementById('gameControls');
    playAgainArea = document.getElementById('playAgainArea');

    // Event Listeners
    playButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameArea.classList.remove('hidden');
        startGame();
    });

    playAgainButton.addEventListener('click', () => {
        playAgainArea.classList.add('hidden');
        gameControls.classList.remove('hidden');
        startGame();
    });

    hitButton.addEventListener('click', playerHit);
    standButton.addEventListener('click', playerStand);
}

export { initBlackjackGame };