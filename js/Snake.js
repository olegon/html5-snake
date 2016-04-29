(function() {
    'use strict';


    function Snake(body_size) {
        this.x = 150;
        this.y = 150;

        this.body_size = body_size || 10;

        this.body = [
            new Rectangle(this.x, this.y, this.body_size, this.body_size),
            new Rectangle(this.x - this.body_size, this.y, this.body_size, this.body_size),
            new Rectangle(this.x - this.body_size * 2, this.y, this.body_size, this.body_size)
        ];
    }

    Snake.DIRECTION_UP = 'up';
    Snake.DIRECTION_DOWN = 'down';
    Snake.DIRECTION_RIGHT = 'right';
    Snake.DIRECTION_LEFT = 'left';

    Snake.prototype.move = function() {
        var dx = 0,
            dy = 0;

        if (this.currentMoviment == Snake.DIRECTION_RIGHT) {
            dx = this.body_size;
        } else if (this.currentMoviment == Snake.DIRECTION_LEFT) {
            dx = -this.body_size;
        } else if (this.currentMoviment == Snake.DIRECTION_UP) {
            dy = -this.body_size;
        } else if (this.currentMoviment == Snake.DIRECTION_DOWN) {
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

    };

    Snake.prototype.setMoviment = function(direction) {
        if (direction == Snake.DIRECTION_LEFT && this.currentMoviment == Snake.DIRECTION_RIGHT) {
            return;
        }

        if (direction == Snake.DIRECTION_RIGHT && this.currentMoviment == Snake.DIRECTION_LEFT) {
            return;
        }

        if (direction == Snake.DIRECTION_DOWN && this.currentMoviment == Snake.DIRECTION_UP) {
            return;
        }

        if (direction == Snake.DIRECTION_UP && this.currentMoviment == Snake.DIRECTION_DOWN) {
            return;
        }

        this.currentMoviment = direction;
    };

    window.Snake = Snake;

})();
