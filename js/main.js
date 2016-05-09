(function() {
    'use strict';

    var CANVAS_ELEMENT_ID = 'mainCanvas';

    var game = Game(CANVAS_ELEMENT_ID);

    game.init(function(state) {
        state.game = {
            'timeElapsedSinceLastRender': 0,
            'minTimeToDraw': 100,
            'fastMode': false
        };

        var SNAKE_BODY_SIZE = 10;
        var canvasElement = state.getCanvasElement();

        state.game.snake = Snake(SNAKE_BODY_SIZE);

        state.game.fruit = Rectangle.createAtRandonPosition(canvasElement.width, canvasElement.height, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
    });


    game.setDrawCallback(function(dt, state) {
        if (state.game_status == game.GAME_OVER) {
            return;
        }

        var minTimeToDraw = state.game.minTimeToDraw;
        if (state.game.fastMode) {
            minTimeToDraw /= 4;
        }

        if (state.game.timeElapsedSinceLastRender < minTimeToDraw) {
            return;
        }


        state.game.timeElapsedSinceLastRender -= minTimeToDraw;

        var ctx = state.get2dContext();

        var snake = state.game.snake;
        var fruit = state.game.fruit;

        if (state.game_status == game.GAME_WILL_END) {
            ctx.fillText('Game Over!', 10, 20);
            state.game_status = game.GAME_OVER;

            return;
        }

        // Mover apenas de renderizar.
        snake.move();

        ctx.save();

        if (state.game.fastMode) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.strokeStyle = 'rgba(128, 0, 0, 1.0)';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
        }


        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        for (var i = 0; i < snake.body.length; i++) {
            var block = snake.body[i];

            ctx.strokeRect(block.x, block.y, block.width, block.height);
        }


        ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
        ctx.strokeRect(fruit.x, fruit.y, fruit.width, fruit.height);

        ctx.restore();
    });

    game.setUpdateCallback(function(dt, state) {
        if (state.game_status == game.GAME_OVER) {
            return;
        }

        state.game.timeElapsedSinceLastRender += dt;

        var snake = state.game.snake;
        var fruit = state.game.fruit;

        var canvasElement = state.getCanvasElement();
        var canvasWidth = canvasElement.width;
        var canvasHeight = canvasElement.height;

        var head = snake.body[0];

        (function checkBoudaries() {
            var MIN_X = 0,
                MAX_X = canvasWidth,
                MIN_Y = 0,
                MAX_Y = canvasHeight;

            if (head.x < MIN_X || head.y < MIN_Y || (head.x + head.width) > MAX_X || (head.y + head.height) > MAX_Y) {
                state.game_status = game.GAME_WILL_END;
            }
        })();

        (function checkBodyCollision() {
            for (var i = 1; i < snake.body.length; i++) {
                var rect = snake.body[i];

                if (head.x == rect.x && head.y == rect.y) {
                    state.game_status = game.GAME_WILL_END;
                }
            }
        })();


        if (state.game_status == game.GAME_WILL_END) {
            return;
        }

        if (state.keyboard.left == true) {
            snake.setMoviment(snake.DIRECTION_LEFT);
            state.game_status = game.GAME_RUNNING;
        } else if (state.keyboard.right == true) {
            snake.setMoviment(snake.DIRECTION_RIGHT);
            state.game_status = game.GAME_RUNNING;
        } else if (state.keyboard.up == true) {
            snake.setMoviment(snake.DIRECTION_UP);
            state.game_status = game.GAME_RUNNING;
        } else if (state.keyboard.down == true) {
            snake.setMoviment(snake.DIRECTION_DOWN);
            state.game_status = game.GAME_RUNNING;
        }

        if (state.keyboard.space) {
            state.game.fastMode = true;
        } else {
            state.game.fastMode = false;
        }

        if (head.x == fruit.x && head.y == fruit.y) {
            snake.eated = fruit;

            state.game.fruit = Rectangle.createAtRandonPosition(canvasWidth, canvasHeight, snake.body_size, snake.body_size);
        }
    });

    game.start();
})();
