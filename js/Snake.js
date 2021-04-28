var SnakeDirection;
(function (SnakeDirection) {
    SnakeDirection[SnakeDirection["DIRECTION_UP"] = 0] = "DIRECTION_UP";
    SnakeDirection[SnakeDirection["DIRECTION_DOWN"] = 1] = "DIRECTION_DOWN";
    SnakeDirection[SnakeDirection["DIRECTION_RIGHT"] = 2] = "DIRECTION_RIGHT";
    SnakeDirection[SnakeDirection["DIRECTION_LEFT"] = 3] = "DIRECTION_LEFT";
})(SnakeDirection || (SnakeDirection = {}));
var Snake = /** @class */ (function () {
    function Snake(bodySize) {
        this.x = 100;
        this.y = 100;
        this.bodySize = bodySize;
        this.body = [
            new Rectangle(this.x, this.y, this.bodySize, this.bodySize),
            new Rectangle(this.x - this.bodySize, this.y, this.bodySize, this.bodySize),
            new Rectangle(this.x - this.bodySize * 2, this.y, this.bodySize, this.bodySize)
        ];
    }
    Snake.prototype.move = function () {
        var dx = 0, dy = 0;
        this.currentDirection = this.nextDirection;
        if (this.currentDirection == null) {
            return;
        }
        if (this.currentDirection == SnakeDirection.DIRECTION_RIGHT) {
            dx = this.bodySize;
        }
        else if (this.currentDirection == SnakeDirection.DIRECTION_LEFT) {
            dx = -this.bodySize;
        }
        else if (this.currentDirection == SnakeDirection.DIRECTION_UP) {
            dy = -this.bodySize;
        }
        else if (this.currentDirection == SnakeDirection.DIRECTION_DOWN) {
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
        if (direction == SnakeDirection.DIRECTION_LEFT && this.currentDirection == SnakeDirection.DIRECTION_RIGHT) {
            return;
        }
        if (direction == SnakeDirection.DIRECTION_RIGHT && this.currentDirection == SnakeDirection.DIRECTION_LEFT) {
            return;
        }
        if (direction == SnakeDirection.DIRECTION_DOWN && this.currentDirection == SnakeDirection.DIRECTION_UP) {
            return;
        }
        if (direction == SnakeDirection.DIRECTION_UP && this.currentDirection == SnakeDirection.DIRECTION_DOWN) {
            return;
        }
        this.nextDirection = direction;
    };
    return Snake;
}());
