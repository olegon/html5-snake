var Snake = (function() {
    'use strict';

    var proto = {
        DIRECTION_UP: 'up',
        DIRECTION_DOWN: 'down',
        DIRECTION_RIGHT: 'right',
        DIRECTION_LEFT: 'left',

        move: function() {
            var dx = 0,
                dy = 0;

            this.currentDirection = this.nextDirection;

            if (this.currentDirection == this.DIRECTION_RIGHT) {
                dx = this.body_size;
            } else if (this.currentDirection == this.DIRECTION_LEFT) {
                dx = -this.body_size;
            } else if (this.currentDirection == this.DIRECTION_UP) {
                dy = -this.body_size;
            } else if (this.currentDirection == this.DIRECTION_DOWN) {
                dy = this.body_size;
            }

            if (this.eated != null) {
                this.body.push(this.eated);
                this.eated = null;
            }


            for (var i = this.body.length - 1; i > 0; i--) {
                this.body[i].x = this.body[i - 1].x;
                this.body[i].y = this.body[i - 1].y;
            }

            this.body[0].x += dx;
            this.body[0].y += dy;

        },
        setMoviment: function(direction) {
            if (direction == this.DIRECTION_LEFT && this.currentDirection == this.DIRECTION_RIGHT) {
                return;
            }

            if (direction == this.DIRECTION_RIGHT && this.currentDirection == this.DIRECTION_LEFT) {
                return;
            }

            if (direction == this.DIRECTION_DOWN && this.currentDirection == this.DIRECTION_UP) {
                return;
            }

            if (direction == this.DIRECTION_UP && this.currentDirection == this.DIRECTION_DOWN) {
                return;
            }

            this.nextDirection = direction;
        }
    };

    return function(body_size) {
        var snake = Object.create(proto);

        snake.x = 150;
        snake.y = 150;

        snake.body_size = body_size || 10;

        snake.body = [
            Rectangle(snake.x, snake.y, snake.body_size, snake.body_size),
            Rectangle(snake.x - snake.body_size, snake.y, snake.body_size, snake.body_size),
            Rectangle(snake.x - snake.body_size * 2, snake.y, snake.body_size, snake.body_size)
        ];

        return snake;
    };

})();
