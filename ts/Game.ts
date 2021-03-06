enum GameStatus {
    GAME_OVER,
    GAME_WILL_END,
    GAME_WAITING_TO_START,
    GAME_RUNNING,
    GAME_PAUSED
}

class Keyboad {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    space: boolean;
}

class CoreState {
    keyboard: Keyboad;

    constructor() {
        this.keyboard = new Keyboad();
    }
}

interface InitCallback<T> {
    (state: T) : void;
}

interface UpdateCallback<T> {
    (dt: number, state: T) : void;
}

interface DrawCallback<T> {
    (dt: number, state: T) : void;
}

interface KeydownCallback<T> {
    (e: KeyboardEvent, state: T) : void;
}

class Game<T> {
    canvasId: string;
    canvasElement: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;

    updateCallback: UpdateCallback<T>;
    drawCallback: DrawCallback<T>;
    keydownCallback: KeydownCallback<T>;

    coreState: CoreState;

    gameState: T;

    gameStatus: GameStatus;

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

        this.coreState = new CoreState();
    }

    init(initCallback: InitCallback<T>) {
        this.gameStatus = GameStatus.GAME_WAITING_TO_START;

        if (initCallback != null) {
            initCallback(this.gameState);
        }
    }

    start () {
        let self = this;

        this.coreState;

        (function inputEventSetup() {
            function preventScrolling(e: KeyboardEvent) : void {
                if ([37, 38, 39, 40, 32].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
            }

            window.addEventListener('keydown', function(e) {
                if (e.keyCode === 37) {
                    self.coreState.keyboard.left = true;
                } else if (e.keyCode === 38) {
                    self.coreState.keyboard.up = true;
                } else if (e.keyCode === 39) {
                    self.coreState.keyboard.right = true;
                } else if (e.keyCode === 40) {
                    self.coreState.keyboard.down = true;
                } else if (e.keyCode === 32) {
                    self.coreState.keyboard.space = true;
                }

                if (self.keydownCallback) {
                    self.keydownCallback(e, self.gameState);
                }

                preventScrolling(e);
            });

            window.addEventListener('keyup', function(e) {
                if (e.keyCode === 37) {
                    self.coreState.keyboard.left = false;
                } else if (e.keyCode === 38) {
                    self.coreState.keyboard.up = false;
                } else if (e.keyCode === 39) {
                    self.coreState.keyboard.right = false;
                } else if (e.keyCode === 40) {
                    self.coreState.keyboard.down = false;
                } else if (e.keyCode === 32) {
                    self.coreState.keyboard.space = false;
                }

                preventScrolling(e);
            });
        })();

        (function gameLoopSetup() {
            let accTime = 0;
            let previousTime = performance.now();

            function gameloop(currentTime: number) {
                // delta time
                let dt = currentTime - previousTime;
                previousTime = currentTime;

                if (self.updateCallback) self.updateCallback(dt, self.gameState);
                if (self.drawCallback) self.drawCallback(dt, self.gameState);

                window.requestAnimationFrame(gameloop);
            }

            window.requestAnimationFrame(gameloop);
        })();
    }

    setUpdateCallback (updateCallback: UpdateCallback<T>) {
        this.updateCallback = updateCallback;
    };

    setDrawCallback (drawCallback: DrawCallback<T>) {
        this.drawCallback = drawCallback;
    };

    setKeydownCallback (keydownCallback: KeydownCallback<T>) {
        this.keydownCallback = keydownCallback;
    }
}
