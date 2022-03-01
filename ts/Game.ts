enum GameStatus {
    GAME_OVER,
    GAME_WILL_END,
    GAME_WAITING_TO_START,
    GAME_RUNNING,
    GAME_PAUSED
}

class Keyboad {
    left = false;
    right = false;
    up = false;
    down = false;
    space = false;
}

class InternalState {
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

    updateCallback: UpdateCallback<T> | null = null;
    drawCallback: DrawCallback<T> | null = null;
    keydownCallback: KeydownCallback<T> | null = null;

    coreState: InternalState;

    gameState: T;

    gameStatus: GameStatus;

    constructor (canvasId: string, gameState: T, gameStatus: GameStatus) {
        this.canvasId = canvasId;

        this.canvasElement = window.document.getElementById(this.canvasId) as HTMLCanvasElement;
        if (this.canvasElement == null) {
            throw new Error('O elemento com Id ' + this.canvasId + ' não existe.');
        }

        const ctx = this.canvasElement.getContext('2d');

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

    init(initCallback: InitCallback<T>) {
        this.gameStatus = GameStatus.GAME_WAITING_TO_START;

        if (initCallback != null) {
            initCallback(this.gameState);
        }
    }

    start () {
        const self = this;

        this.coreState;

        (function inputEventSetup() {
            function preventScrolling(e: KeyboardEvent) : void {
                if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Space'].indexOf(e.code) > -1) {
                    e.preventDefault();
                }
            }

            window.addEventListener('keydown', function(e) {                
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

            window.addEventListener('keyup', function(e) {
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
            let previousTime = performance.now();

            function gameloop(currentTime: number) {
                // delta time
                const dt = currentTime - previousTime;
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
