(function() {
    'use strict';

    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
    }

    Rectangle.createAtRandonPosition = function(max_x, max_y, width, height) {
        var rnd_x = parseInt(Math.random() * 50000) % max_x;
        var rnd_y = parseInt(Math.random() * 50000) % max_y;


        var x = rnd_x - (rnd_x % width);
        var y = rnd_y - (rnd_y % height);

        return new Rectangle(x, y, width, height);
    };

    Rectangle.prototype.checkCollision = function(rect) {
        if (!(rect instanceof Rectangle)) {
            throw new TypeError("Rectangle.checkCollision(rect): rect ins't a Rectangle.");
        }
    };

    window.Rectangle = Rectangle;

})();
