(function() {
    'use strict';

    function Game(canvasId) {
        this.canvasId = canvasId;

        this.state = {
            min_draw_time: 100,
            game: {

            }
        };
    }

    Game.GAME_OVER = 'game_over';
    Game.GAME_WAITING_TO_START = 'game_waiting_to_start';
    Game.GAME_RUNNING = 'game_running';

    Game.prototype.init = function(initFunction) {
        this.state.canvasElement = window.document.getElementById(this.canvasId);
        this.state.canvasCtx = this.state.canvasElement.getContext('2d');

        this.state.game.game_status = Game.GAME_WAITING_TO_START;

        if (initFunction) initFunction(this.state);
    };

    Game.prototype.start = function() {
        var self = this;

        var state = this.state;

        state.keyboard = {
            space: false,
            left: false,
            right: false,
            up: false,
            down: false
        };

        (function inputEventSetup() {
            window.addEventListener('keydown', function(e) {
                if (e.keyCode === 37) {
                    state.keyboard.left = true;
                } else if (e.keyCode === 38) {
                    state.keyboard.up = true;
                } else if (e.keyCode === 39) {
                    state.keyboard.right = true;
                } else if (e.keyCode === 40) {
                    state.keyboard.down = true;
                } else if (e.keyCode === 32) {
                    state.keyboard.space = true;
                }
            });

            window.addEventListener('keyup', function(e) {
                if (e.keyCode === 37) {
                    state.keyboard.left = false;
                } else if (e.keyCode === 38) {
                    state.keyboard.up = false;
                } else if (e.keyCode === 39) {
                    state.keyboard.right = false;
                } else if (e.keyCode === 40) {
                    state.keyboard.down = false;
                } else if (e.keyCode === 32) {
                    state.keyboard.space = false;
                }
            });
        })();

        (function gameLoopSetup() {
            var accTime = 0;
            var previousTime = performance.now();

            function gameloop(currentTime) {
                // delta time
                var dt = currentTime - previousTime;
                previousTime = currentTime;

                accTime += dt;

                if (self.updateCallback) self.updateCallback(dt, state);

                if (accTime > state.min_draw_time) {
                    accTime -= state.min_draw_time;

                    if (self.drawCallback) self.drawCallback(dt, state);
                }

                window.requestAnimationFrame(gameloop);
            }

            window.requestAnimationFrame(gameloop);
        })();
    };

    Game.prototype.setUpdateCallback = function(updateCallback) {
        this.updateCallback = updateCallback;
    };

    Game.prototype.setDrawCallback = function(drawCallback) {
        this.drawCallback = drawCallback;
    };

    window.Game = Game;

})();
