"use strict";
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rectangle.createAtRandonPosition = function (max_x, max_y, width, height) {
        var rnd_x = (Math.random() * 50000) % max_x;
        var rnd_y = (Math.random() * 50000) % max_y;
        var x = rnd_x - (rnd_x % width);
        var y = rnd_y - (rnd_y % height);
        return new Rectangle(x, y, width, height);
    };
    Rectangle.prototype.strokeRect = function (ctx) {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };
    return Rectangle;
}());
