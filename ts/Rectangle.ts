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
        let rnd_x = (Math.random() * 50000) % max_x;
        let rnd_y = (Math.random() * 50000) % max_y;

        let x = rnd_x - (rnd_x % width);
        let y = rnd_y - (rnd_y % height);

        return new Rectangle(x, y, width, height);
    }
}
