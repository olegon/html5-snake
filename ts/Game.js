var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["GAME_OVER"] = 0] = "GAME_OVER";
    GameStatus[GameStatus["GAME_WILL_END"] = 1] = "GAME_WILL_END";
    GameStatus[GameStatus["GAME_WAITING_TO_START"] = 2] = "GAME_WAITING_TO_START";
    GameStatus[GameStatus["GAME_RUNNING"] = 3] = "GAME_RUNNING";
    GameStatus[GameStatus["GAME_PAUSED"] = 4] = "GAME_PAUSED";
})(GameStatus || (GameStatus = {}));
var Game = (function () {
    function Game(canvasId) {
        this.canvasId = canvasId;
        this.canvasElement = window.document.getElementById(this.canvasId);
        if (this.canvasElement == null) {
            throw new Error('O elemento com Id ' + this.canvasId + ' não existe.');
        }
        this.canvasContext = this.canvasElement.getContext('2d');
        if (this.canvasContext == null) {
            throw new Error("O elemento não existe.");
        }
        this.state = {
            game: {}
        };
    }
    Game.prototype.init = function (initCallback) {
        this.gameStatus = GameStatus.GAME_WAITING_TO_START;
        if (initCallback != null) {
            initCallback(this.state);
        }
    };
    Game.prototype.start = function () {
        var self = this;
        this.state.keyboard = {
            space: false,
            left: false,
            right: false,
            up: false,
            down: false
        };
        (function inputEventSetup() {
            function preventScrolling(e) {
                if ([37, 38, 39, 40, 32].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
            }
            window.addEventListener('keydown', function (e) {
                if (e.keyCode === 37) {
                    self.state.keyboard.left = true;
                }
                else if (e.keyCode === 38) {
                    self.state.keyboard.up = true;
                }
                else if (e.keyCode === 39) {
                    self.state.keyboard.right = true;
                }
                else if (e.keyCode === 40) {
                    self.state.keyboard.down = true;
                }
                else if (e.keyCode === 32) {
                    self.state.keyboard.space = true;
                }
                if (self.keydownCallback) {
                    self.keydownCallback(e, self.state);
                }
                preventScrolling(e);
            });
            window.addEventListener('keyup', function (e) {
                if (e.keyCode === 37) {
                    self.state.keyboard.left = false;
                }
                else if (e.keyCode === 38) {
                    self.state.keyboard.up = false;
                }
                else if (e.keyCode === 39) {
                    self.state.keyboard.right = false;
                }
                else if (e.keyCode === 40) {
                    self.state.keyboard.down = false;
                }
                else if (e.keyCode === 32) {
                    self.state.keyboard.space = false;
                }
                preventScrolling(e);
            });
        })();
        (function gameLoopSetup() {
            var accTime = 0;
            var previousTime = performance.now();
            function gameloop(currentTime) {
                var dt = currentTime - previousTime;
                previousTime = currentTime;
                if (self.updateCallback)
                    self.updateCallback(dt, self.state);
                if (self.drawCallback)
                    self.drawCallback(dt, self.state);
                window.requestAnimationFrame(gameloop);
            }
            window.requestAnimationFrame(gameloop);
        })();
    };
    Game.prototype.setUpdateCallback = function (updateCallback) {
        this.updateCallback = updateCallback;
    };
    ;
    Game.prototype.setDrawCallback = function (drawCallback) {
        this.drawCallback = drawCallback;
    };
    ;
    Game.prototype.setKeydownCallback = function (keydownCallback) {
        this.keydownCallback = keydownCallback;
    };
    return Game;
}());
