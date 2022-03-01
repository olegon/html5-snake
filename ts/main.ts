class GameState {
    timeElapsedSinceLastRender = 0;
    minTimeToDraw = 0;
    fastMode = false;

    snake: Snake | null = null;
    fruit: Rectangle | null = null;
}

window.addEventListener('load', function () {
    const CANVAS_ELEMENT_ID = 'mainCanvas';
    const game = new Game<GameState>(CANVAS_ELEMENT_ID, new GameState(), GameStatus.GAME_WAITING_TO_START);

    game.init(function (gameState: GameState) {
        gameState.timeElapsedSinceLastRender = 0;
        gameState.minTimeToDraw = 100;
        gameState.fastMode = false;

        const SNAKE_BODY_SIZE = 10;
        const canvasElement = game.canvasElement;

        gameState.snake = new Snake(SNAKE_BODY_SIZE);

        gameState.fruit = Rectangle.createAtRandonPosition(canvasElement.width, canvasElement.height, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
    });

    game.setDrawCallback(function (dt, state) {
        let minTimeToDraw = state.minTimeToDraw;

        if (state.fastMode) {
            minTimeToDraw /= 10;
        }

        if (state.timeElapsedSinceLastRender < minTimeToDraw) {
            return;
        }


        state.timeElapsedSinceLastRender -= minTimeToDraw;

        if (game.gameStatus == GameStatus.GAME_OVER || game.gameStatus == GameStatus.GAME_PAUSED) {
            return;
        }

        const ctx: CanvasRenderingContext2D = game.canvasContext;

        if (game.gameStatus == GameStatus.GAME_WILL_END) {
            ctx.fillText('Game Over!', 10, 20);
            game.gameStatus = GameStatus.GAME_OVER;

            return;
        }

        // Mover apenas de renderizar.
        state.snake?.move();

        ctx.save();

        ctx.fillRect(0, 0, game.canvasElement.width, game.canvasElement.height);

        if (state.fastMode) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.strokeStyle = 'rgba(128, 0, 0, 1.0)';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
        }

        ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
        state.fruit?.strokeRect(ctx);

        ctx.restore();
    })

    game.setKeydownCallback(function(e, state) {
        // ESC
        if (e.keyCode == 27) {
            if (game.gameStatus == GameStatus.GAME_RUNNING) {
                game.gameStatus = GameStatus.GAME_PAUSED;
            } else if (game.gameStatus == GameStatus.GAME_PAUSED) {
                game.gameStatus = GameStatus.GAME_RUNNING;
            }
        };
    });

    game.setUpdateCallback(function(dt, state) {
        if (game.gameStatus == GameStatus.GAME_OVER) {
            return;
        }

        state.timeElapsedSinceLastRender += dt;

        if (state.snake == null || state.fruit == null) return;

        const snake: Snake = state.snake;
        const fruit: Rectangle = state.fruit;

        const canvasElement = game.canvasElement;
        const canvasWidth = canvasElement.width;
        const canvasHeight = canvasElement.height;

        const head = snake.body[0];

        (function checkBoudaries() {
            const MIN_X = 0,
                MAX_X = canvasWidth,
                MIN_Y = 0,
                MAX_Y = canvasHeight;

            if (head.x < MIN_X || head.y < MIN_Y || (head.x + head.width) > MAX_X || (head.y + head.height) > MAX_Y) {
                game.gameStatus = GameStatus.GAME_WILL_END;
            }
        })();

        (function checkBodyCollision() {
            for (let i = 1; i < snake.body.length; i++) {
                const rect = snake.body[i];

                if (head.x == rect.x && head.y == rect.y) {
                    game.gameStatus = GameStatus.GAME_WILL_END;
                }
            }
        })();

        if (game.gameStatus == GameStatus.GAME_WILL_END) {
            return;
        }

        if (game.coreState.keyboard.left == true) {
            snake.setMoviment(SnakeDirection.DIRECTION_LEFT);
            game.gameStatus = GameStatus.GAME_RUNNING;
        } else if (game.coreState.keyboard.right == true) {
            snake.setMoviment(SnakeDirection.DIRECTION_RIGHT);
            game.gameStatus = GameStatus.GAME_RUNNING;
        } else if (game.coreState.keyboard.up == true) {
            snake.setMoviment(SnakeDirection.DIRECTION_UP);
            game.gameStatus = GameStatus.GAME_RUNNING;
        } else if (game.coreState.keyboard.down == true) {
            snake.setMoviment(SnakeDirection.DIRECTION_DOWN);
            game.gameStatus = GameStatus.GAME_RUNNING;
        }

        if (game.coreState.keyboard.space) {
            state.fastMode = true;
        } else {
            state.fastMode = false;
        }

        if (head.x == fruit.x && head.y == fruit.y) {
            snake.eated = fruit;

            state.fruit = Rectangle.createAtRandonPosition(canvasWidth, canvasHeight, snake.bodySize, snake.bodySize);
        }
    });

    game.start();
});
