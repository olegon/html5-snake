enum GameStatus {
    GAME_OVER,
    GAME_WILL_END,
    GAME_WAITING_TO_START,
    GAME_RUNNING,
    GAME_PAUSED
}

class Game {
    canvasId: string;
    canvasElement: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;

    keydownCallback: Function;
    updateCallback: Function;
    drawCallback: Function;

    coreState: any;

    public state: any;
    public gameStatus: GameStatus;

    constructor (canvasId: string) {
        this.canvasId = canvasId;

        this.canvasElement = <HTMLCanvasElement>window.document.getElementById(this.canvasId);

        if (this.canvasElement == null) {
            throw new Error('O elemento com Id ' + this.canvasId + ' não existe.');
        }

        this.canvasContext = this.canvasElement.getContext('2d');

        if (this.canvasContext == null) {
            throw new Error("O elemento não existe.");
        }

        this.state = {
            game: {

            }
        };
    }

    init(initCallback: Function) {
        this.gameStatus = GameStatus.GAME_WAITING_TO_START;

        if (initCallback != null) {
            initCallback(this.state);
        }
    }

    start () {
        let self = this;

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

                if (self.keydownCallback) {
                    self.keydownCallback(e, self.state);
                }

                preventScrolling(e);
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

                preventScrolling(e);
            });
        })();

        (function gameLoopSetup() {
            let accTime = 0;
            let previousTime = performance.now();

            function gameloop(currentTime) {
                // delta time
                let dt = currentTime - previousTime;
                previousTime = currentTime;

                if (self.updateCallback) self.updateCallback(dt, self.state);
                if (self.drawCallback) self.drawCallback(dt, self.state);

                window.requestAnimationFrame(gameloop);
            }

            window.requestAnimationFrame(gameloop);
        })();
    }

    setUpdateCallback (updateCallback: Function) {
        this.updateCallback = updateCallback;
    };

    setDrawCallback (drawCallback: Function) {
        this.drawCallback = drawCallback;
    };

    setKeydownCallback (keydownCallback: Function) {
        this.keydownCallback = keydownCallback;
    }
}
