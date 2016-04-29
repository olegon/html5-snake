(function() {
    'use strict';

    function Game(canvasId) {
        this.canvasId = canvasId;

        this.state = {
            engine: {

            },
            game: {

            }
        };
    }

    Game.GAME_OVER = 'game_over';
    Game.GAME_WAITING_TO_START = 'game_waiting_to_start';
    Game.GAME_RUNNING = 'game_running';
    
    Game.prototype.init = function(initFunction) {
        this.state.engine.canvasElement = window.document.getElementById(this.canvasId);
        this.state.engine.canvasCtx = this.state.canvasElement.getContext('2d');

        this.state.game.game_status = Game.GAME_WAITING_TO_START;

        if (initFunction) initFunction(this.state);
    };

    Game.prototype.start = function() {
        var self = this;

        self.state.keyboard = {
            space: false,
            left: false,
            right: false,
            up: false,
            down: false
        };

        (function inputEventSetup() {
            window.addEventListener('keydown', function(e) {
                if (e.keyCode === 37) {
                    self.state.keyboard.left = true;
                } else if (e.keyCode === 38) {
                    self.state.keyboard.up = true;
                } else if (e.keyCode === 39) {
                    self.state.keyboard.right = true;
                } else if (e.keyCode === 40) {
                    self.state.keyboard.down = true;
                } else if (e.keyCode === 32) {
                    self.state.keyboard.space = true;
                }
            });

            window.addEventListener('keyup', function(e) {
                if (e.keyCode === 37) {
                    self.state.keyboard.left = false;
                } else if (e.keyCode === 38) {
                    self.state.keyboard.up = false;
                } else if (e.keyCode === 39) {
                    self.state.keyboard.right = false;
                } else if (e.keyCode === 40) {
                    self.state.keyboard.down = false;
                } else if (e.keyCode === 32) {
                    self.state.keyboard.space = false;
                }
            });
        })();

        (function gameLoopSetup() {
            var previousTime = performance.now();

            function gameloop(currentTime) {
                // delta time
                var dt = currentTime - previousTime;
                previousTime = currentTime;

                if (self.updateCallback) self.updateCallback(dt, state);
                if (self.drawCallback) self.drawCallback(dt, state, self.state.engine.canvasCtx);

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
