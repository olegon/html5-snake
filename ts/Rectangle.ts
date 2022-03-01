class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    static createAtRandonPosition(max_x: number, max_y: number, width: number, height: number) {
        const rnd_x = (Math.random() * 50000) % max_x;
        const rnd_y = (Math.random() * 50000) % max_y;

        const x = rnd_x - (rnd_x % width);
        const y = rnd_y - (rnd_y % height);

        return new Rectangle(x, y, width, height);
    }

    strokeRect(ctx: CanvasRenderingContext2D): void {   
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
