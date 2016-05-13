class GameState {
    timeElapsedSinceLastRender: number;
    minTimeToDraw: number;
    fastMode: boolean;

    snake: Snake;
    fruit: Rectangle;
}

window.addEventListener('load', function () {
    let CANVAS_ELEMENT_ID = 'mainCanvas';

    let game = new Game<GameState>(CANVAS_ELEMENT_ID);
    game.gameState = new GameState();

    game.init(function (gameState: GameState) {


        gameState.timeElapsedSinceLastRender = 0;
        gameState.minTimeToDraw = 100;
        gameState.fastMode = false;

        let SNAKE_BODY_SIZE = 10;
        let canvasElement = game.canvasElement;

        gameState.snake = new Snake(SNAKE_BODY_SIZE);

        gameState.fruit = Rectangle.createAtRandonPosition(canvasElement.width, canvasElement.height, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
    });

    game.setDrawCallback(function (dt, state) {
        let minTimeToDraw = state.minTimeToDraw;

        if (state.fastMode) {
            minTimeToDraw /= 4;
        }

        if (state.timeElapsedSinceLastRender < minTimeToDraw) {
            return;
        }


        state.timeElapsedSinceLastRender -= minTimeToDraw;

        if (game.gameStatus == GameStatus.GAME_OVER || game.gameStatus == GameStatus.GAME_PAUSED) {
            return;
        }

        let ctx: CanvasRenderingContext2D = game.canvasContext;

        let snake = state.snake;
        let fruit = state.fruit;

        if (game.gameStatus == GameStatus.GAME_WILL_END) {
            ctx.fillText('Game Over!', 10, 20);
            game.gameStatus = GameStatus.GAME_OVER;

            return;
        }

        // Mover apenas de renderizar.
        snake.move();

        ctx.save();

        if (state.fastMode) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.strokeStyle = 'rgba(128, 0, 0, 1.0)';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
        }

        ctx.fillRect(0, 0, game.canvasElement.width, game.canvasElement.height);

        for (let i = 0; i < snake.body.length; i++) {
            let block = snake.body[i];

            ctx.strokeRect(block.x, block.y, block.width, block.height);
        }

        ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
        ctx.strokeRect(fruit.x, fruit.y, fruit.width, fruit.height);

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

        let snake: Snake = state.snake;
        let fruit: Rectangle = state.fruit;

        let canvasElement = game.canvasElement;
        let canvasWidth = canvasElement.width;
        let canvasHeight = canvasElement.height;

        let head = snake.body[0];

        (function checkBoudaries() {
            let MIN_X = 0,
                MAX_X = canvasWidth,
                MIN_Y = 0,
                MAX_Y = canvasHeight;

            if (head.x < MIN_X || head.y < MIN_Y || (head.x + head.width) > MAX_X || (head.y + head.height) > MAX_Y) {
                game.gameStatus = GameStatus.GAME_WILL_END;
            }
        })();

        (function checkBodyCollision() {
            for (let i = 1; i < snake.body.length; i++) {
                let rect = snake.body[i];

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
