// --- 1. DOM Elements Selection ---
// Selecting all necessary HTML elements to interact with them in JS
const board = document.querySelector('.board')
const startGameModal = document.querySelector('.startGameModal')
const startGameButton = document.querySelector('.startGameButton')
const reStartGameModal = document.querySelector('.reStartGameModal')
const reStartGameButton = document.querySelector('.reStartGameButton')
const scoreValue = document.querySelector('.score-value')
const timeValue = document.querySelector('.time-value')

// Initially hide the restart (Game Over) modal
reStartGameModal.style.display = "none";

// --- 2. Game Board Grid Setup ---
// Define the dimensions of a single block
const blockHeight = 30
const blockWidth = 30

// Calculate how many columns and rows fit into the board container
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

// --- 3. Game State Variables ---
let intervalId = null;     // ID for the main game movement loop
let timeIntervalId = null; // ID for the timer update loop
let seconds = 0;           // Track the game time in seconds

const blocks = [] // Stores reference to all grid blocks by their coordinates
// Initialize the snake at a starting position
let snake = [
    {
        x: 1, y: 6
    }
]

// Place the initial food randomly on the board
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

// Set the initial moving direction
let direction = 'down'

// Track the current score
let score = 0;

// --- 4. Initialize Board UI ---
// Create the visual grid according to calculated rows and cols
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block"); // Apply block styling
        board.appendChild(block);
        // Store and index the block with a string key (e.g. "0-0", "1-5")
        blocks[`${row}-${col}`] = block
    }
}

// --- 5. Main Game Loop function ---
// This handles movement, drawing, collisions, and eating logic
function render() {
    let head = null;

    // Show food block by applying the food sub-class
    blocks[`${food.x}-${food.y}`].classList.add("food")

    // Determine the next position based on the current movement direction
    if (direction == "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 } // Move left (-1 along Y axis due to row-col architecture)
    } else if (direction == "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 } // Move right (+1 along Y axis)
    } else if (direction == "down") {
        head = { x: snake[0].x + 1, y: snake[0].y } // Move down (+1 along X axis)
    } else if (direction == "up") {
        head = { x: snake[0].x - 1, y: snake[0].y } // Move up (-1 along X axis)
    }

    // --- 6. Collision Detection (Walls) ---
    // Does the snake go out of bounds?
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId); // Stop main loop
        clearInterval(timeIntervalId); // Stop the timer
        // Show Game Over / Restart dialog 
        reStartGameModal.style.display = "flex";
        return;
    }

    // --- 7. Snake Eats Food Logic ---
    // If snake's next step matches the food block
    if (head.x == food.x && head.y == food.y) {
        // Remove old food
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        
        // Randomly generate a new location for food
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add("food")
        
        // Snake actually grows by keeping its new head without popping the tail!
        snake.unshift(head)
        
        // Add point to the total score and show it
        score++;
        scoreValue.innerText = score
    }

    // Clean up the visual trails of the snake to redraw it on its new position
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    // Advance snake - insert new position at the front (head)
    snake.unshift(head)
    // Remove last piece of the tail
    snake.pop()
    
    // Draw the whole snake body in its updated position
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
    })
}

// Helper utility to convert running seconds into a formatted UI timer (MM:SS)
function updateTime() {
    seconds++;
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timeValue.innerText = `${m}:${s}`;
}

// --- 8. Event Listeners for Handling User Actions ---

// Triggered when first launching the game via the Start button
startGameButton.addEventListener("click", () => {
    startGameModal.style.display = "none"; // Hide initial popup
    // Start game loop invoking the render function repeatedly (200ms -> game speed)
    intervalId = setInterval(() => {
        render()
    }, 200)
    // Start time loop 
    timeIntervalId = setInterval(updateTime, 1000);
})

// Triggered when Player lost and clicks the Restart Game button on Game Over Window
reStartGameButton.addEventListener("click", () => {
    // 1. Clear out previous snake trail from the grid
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    // 2. Remove previously drawn food
    blocks[`${food.x}-${food.y}`].classList.remove("food")

    // 3. Reset game states fully
    reStartGameModal.style.display = "none";
    snake = [
        {
            x: 1, y: 6
        }
    ]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    direction = 'down'
    scoreValue.innerText = "00"
    score = 0;
    seconds = 0;
    timeValue.innerText = "00:00";
    
    // 4. Start the game loops afresh
    intervalId = setInterval(() => {
        render()
    }, 200)
    timeIntervalId = setInterval(updateTime, 1000);
})

// --- 9. Keyboard Event Inputs setup for controlling the Snake ---
addEventListener("keydown", (event) => {
    // Modify intended direction depending on what arrow key was registered
    if (event.key == "ArrowUp") {
        direction = "up"
    } else if (event.key == "ArrowRight") {
        direction = "right"
    } else if (event.key == "ArrowDown") {
        direction = "down"
    } else if (event.key == "ArrowLeft") {
        direction = "left"
    }
})