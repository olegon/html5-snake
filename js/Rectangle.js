var Rectangle = (function() {
    'use strict';

    var proto = {

    };

    var Rectangle = function(x, y, width, height) {
        var rectangle = {};

        rectangle.x = x;
        rectangle.y = y;

        rectangle.width = width;
        rectangle.height = height;

        return rectangle;
    };

    Rectangle.createAtRandonPosition = function(max_x, max_y, width, height) {
        var rnd_x = parseInt(Math.random() * 50000) % max_x;
        var rnd_y = parseInt(Math.random() * 50000) % max_y;


        var x = rnd_x - (rnd_x % width);
        var y = rnd_y - (rnd_y % height);

        return Rectangle(x, y, width, height);
    };

    return Rectangle;

})();
