export default class Platform {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        fill(100, 200, 100);
        rect(this.x, this.y, this.w, this.h, 6);
    }
}