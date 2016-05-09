var Snake = (function() {
    'use strict';

    function Snake(bodySize) {
        if (!(this instanceof Snake)) {
            return new Snake(bodySize);
        }

        this.x = 150;
        this.y = 150;

        this.bodySize = bodySize || 10;

        this.body = [
            Rectangle(this.x, this.y, this.bodySize, this.bodySize),
            Rectangle(this.x - this.bodySize, this.y, this.bodySize, this.bodySize),
            Rectangle(this.x - this.bodySize * 2, this.y, this.bodySize, this.bodySize)
        ];
    }

    Snake.prototype.DIRECTION_UP = 'DIRECTION_UP';
    Snake.prototype.DIRECTION_DOWN = 'DIRECTION_DOWN';
    Snake.prototype.DIRECTION_RIGHT = 'DIRECTION_RIGHT';
    Snake.prototype.DIRECTION_LEFT = 'DIRECTION_LEFT';

    Snake.prototype.move = function () {
        var dx = 0,
            dy = 0;

        this.currentDirection = this.nextDirection;

        if (this.currentDirection == null) {
            return;
        }

        if (this.currentDirection == this.DIRECTION_RIGHT) {
            dx = this.bodySize;
        } else if (this.currentDirection == this.DIRECTION_LEFT) {
            dx = -this.bodySize;
        } else if (this.currentDirection == this.DIRECTION_UP) {
            dy = -this.bodySize;
        } else if (this.currentDirection == this.DIRECTION_DOWN) {
            dy = this.bodySize;
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

    Snake.prototype.setMoviment = function (direction) {
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
    };

    return Snake;

})();
