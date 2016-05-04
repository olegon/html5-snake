(function() {
    'use strict';

    function Game(canvasId) {
        var self = this;

        self.canvasId = canvasId;

        self.coreState = {

        };

        self.state = {
            'get2dContext': function() {
                return self.coreState.canvasCtx;
            },
            'getCanvasElement': function() {
                return self.coreState.canvasElement;
            },
        };
    }

    Game.GAME_OVER = 'game_over';
    Game.GAME_WILL_END = 'game_will_end';
    Game.GAME_WAITING_TO_START = 'game_waiting_to_start';
    Game.GAME_RUNNING = 'game_running';

    Game.prototype.init = function(initFunction) {
        this.coreState.canvasElement = window.document.getElementById(this.canvasId);

        if (this.coreState.canvasElement == null) {
            throw new Error('O elemento Canvas cujo id é "' + this.canvasId + '" não foi encontrado.');
        }

        this.coreState.canvasCtx = this.coreState.canvasElement.getContext('2d');

        if (this.coreState.canvasCtx == null) {
            throw new Error('Não foi possível obter o contexto 2d do elemento Canvas.');
        }

        this.state.game_status = Game.GAME_WAITING_TO_START;

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

                if (self.updateCallback) self.updateCallback(dt, self.state);
                if (self.drawCallback) self.drawCallback(dt, self.state);

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
