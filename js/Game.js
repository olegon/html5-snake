"use strict";
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["GAME_OVER"] = 0] = "GAME_OVER";
    GameStatus[GameStatus["GAME_WILL_END"] = 1] = "GAME_WILL_END";
    GameStatus[GameStatus["GAME_WAITING_TO_START"] = 2] = "GAME_WAITING_TO_START";
    GameStatus[GameStatus["GAME_RUNNING"] = 3] = "GAME_RUNNING";
    GameStatus[GameStatus["GAME_PAUSED"] = 4] = "GAME_PAUSED";
})(GameStatus || (GameStatus = {}));
var Keyboad = /** @class */ (function () {
    function Keyboad() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.space = false;
    }
    return Keyboad;
}());
var InternalState = /** @class */ (function () {
    function InternalState() {
        this.keyboard = new Keyboad();
    }
    return InternalState;
}());
var Game = /** @class */ (function () {
    function Game(canvasId, gameState, gameStatus) {
        this.updateCallback = null;
        this.drawCallback = null;
        this.keydownCallback = null;
        this.canvasId = canvasId;
        this.canvasElement = window.document.getElementById(this.canvasId);
        if (this.canvasElement == null) {
            throw new Error('O elemento com Id ' + this.canvasId + ' não existe.');
        }
        var ctx = this.canvasElement.getContext('2d');
        if (ctx == null) {
            throw new Error('O contexto do canvas não pode ser obtido.');
        }
        this.canvasContext = ctx;
        if (this.canvasContext == null) {
            throw new Error("O elemento não existe.");
        }
        this.coreState = new InternalState();
        this.gameState = gameState;
        this.gameStatus = gameStatus;
    }
    Game.prototype.init = function (initCallback) {
        this.gameStatus = GameStatus.GAME_WAITING_TO_START;
        if (initCallback != null) {
            initCallback(this.gameState);
        }
    };
    Game.prototype.start = function () {
        var self = this;
        this.coreState;
        (function inputEventSetup() {
            function preventScrolling(e) {
                if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Space'].indexOf(e.code) > -1) {
                    e.preventDefault();
                }
            }
            window.addEventListener('keydown', function (e) {
                switch (e.code) {
                    case "ArrowLeft":
                        self.coreState.keyboard.left = true;
                        break;
                    case "ArrowUp":
                        self.coreState.keyboard.up = true;
                        break;
                    case "ArrowRight":
                        self.coreState.keyboard.right = true;
                        break;
                    case "ArrowDown":
                        self.coreState.keyboard.down = true;
                        break;
                    case "Space":
                        self.coreState.keyboard.space = true;
                        break;
                }
                if (self.keydownCallback) {
                    self.keydownCallback(e, self.gameState);
                }
                preventScrolling(e);
            });
            window.addEventListener('keyup', function (e) {
                switch (e.code) {
                    case "ArrowLeft":
                        self.coreState.keyboard.left = false;
                        break;
                    case "ArrowUp":
                        self.coreState.keyboard.up = false;
                        break;
                    case "ArrowRight":
                        self.coreState.keyboard.right = false;
                        break;
                    case "ArrowDown":
                        self.coreState.keyboard.down = false;
                        break;
                    case "Space":
                        self.coreState.keyboard.space = false;
                        break;
                }
                preventScrolling(e);
            });
        })();
        (function gameLoopSetup() {
            var previousTime = performance.now();
            function gameloop(currentTime) {
                // delta time
                var dt = currentTime - previousTime;
                previousTime = currentTime;
                if (self.updateCallback)
                    self.updateCallback(dt, self.gameState);
                if (self.drawCallback)
                    self.drawCallback(dt, self.gameState);
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
