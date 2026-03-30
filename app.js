const board = document.querySelector('.board')
const startGameModal = document.querySelector('.startGameModal')
const startGameButton = document.querySelector('.startGameButton')
const reStartGameModal = document.querySelector('.reStartGameModal')
const reStartGameButton = document.querySelector('.reStartGameButton')

reStartGameModal.style.display = "none";

const blockHeight = 60
const blockWidth = 60

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;

const blocks = []
let snake = [
    {
        x: 1, y: 6
    }
]

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

let direction = 'down'

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        block.innerText = `${row}-${col}`
        blocks[`${row}-${col}`] = block
    }
}

function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food")

    if (direction == "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction == "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction == "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction == "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        reStartGameModal.style.display = "flex";
        return;
    }

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add("food")
        snake.unshift(head)
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    snake.unshift(head)
    snake.pop()
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
    })
}

startGameButton.addEventListener("click", () => {
    startGameModal.style.display = "none";
    intervalId = setInterval(() => {
        render()
    }, 400)
})

reStartGameButton.addEventListener("click", () => {
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    blocks[`${food.x}-${food.y}`].classList.remove("food")

    reStartGameModal.style.display = "none";
    snake = [
        {
            x: 1, y: 6
        }
    ]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    direction = 'down'
    intervalId = setInterval(() => {
        render()
    }, 400)
})

addEventListener("keydown", (event) => {
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