// character.js
export class Character {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        fill(80, 120, 200);
        rect(this.x, this.y, this.w, this.h, 6);
    }
}
