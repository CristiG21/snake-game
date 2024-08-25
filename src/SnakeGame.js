import React, {useState, useEffect} from 'react';
import './SnakeGame.css';

function SnakeGame() {
    const rootStyles = getComputedStyle(document.documentElement);
    const lines = parseInt(rootStyles.getPropertyValue('--lines'), 10);
    const columns = parseInt(rootStyles.getPropertyValue('--columns'), 10);

    const initialState = {
        snake: [{x: 1, y: Math.floor(lines / 2)}],
        food: {x: columns - 4, y: Math.floor(lines / 2)},
        direction: 'RIGHT',
        gameStarted: false,
        gameOver: false
    };

    const [snake, setSnake] = useState(initialState.snake);
    const [food, setFood] = useState(initialState.food);
    const [direction, setDirection] = useState(initialState.direction);
    const [gameStarted, setGameStarted] = useState(initialState.gameStarted);
    const [gameOver, setGameOver] = useState(initialState.gameOver);

    const resetGame = () => {
        setSnake(initialState.snake);
        setFood(initialState.food);
        setDirection(initialState.direction);
        setGameOver(initialState.gameOver);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Tab':
                    setGameStarted(true);
                    break;
                case 'r':
                    resetGame();
                    break;
                case 'ArrowUp':
                    setDirection('UP');
                    break;
                case 'ArrowDown':
                    setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    setDirection('LEFT');
                    break;
                case 'ArrowRight':
                    setDirection('RIGHT');
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const moveSnake = () => {
            const newSnake = [...snake];
            const head = {...newSnake[0]};

            switch (direction) {
                case 'UP':
                    head.y -= 1;
                    break;
                case 'DOWN':
                    head.y += 1;
                    break;
                case 'LEFT':
                    head.x -= 1;
                    break;
                case 'RIGHT':
                    head.x += 1;
                    break;
                default:
                    break;
            }

            const generateNewFood = () => {
                let found = false;

                while (!found) {
                    const x = Math.floor(Math.random() * columns);
                    const y = Math.floor(Math.random() * lines);
                    found = !newSnake.some(segment => segment.x === x && segment.y === y);
                    if (found)
                        setFood({x, y});
                }
            }

            newSnake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                if (newSnake.length !== lines * columns)
                    generateNewFood();
            } else {
                newSnake.pop();
            }

            if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= lines || newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
                setGameOver(true);
            } else {
                setSnake(newSnake);
            }
        };

        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, direction, food, gameOver, gameStarted]);

    return (
        <div className="snake-game">
            <div className="helper-text">
                <ul>
                    <li>Press TAB to start</li>
                    <li>Press R to restart</li>
                </ul>
            </div>
            <div
                className="game-over">{gameOver ? (snake.length === lines * columns ? 'Game Won!' : 'Game Over') : '‎'}</div>
            <div className="game-board">
                {Array.from({length: lines}).map((_, row) => (
                    <div key={row} className="row">
                        {Array.from({length: columns}).map((_, col) => (
                            <div
                                key={col}
                                className={`cell ${
                                    snake.some(segment => segment.x === col && segment.y === row)
                                        ? 'snake'
                                        : food.x === col && food.y === row
                                            ? 'food'
                                            : ''
                                }`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SnakeGame;