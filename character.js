// character.js
export class Character {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        fill(20, 120, 200);
        stroke(0);
        strokeWeight(1);
        rect(this.x, this.y, this.w, this.h, 6);
    }
}

export {Character};