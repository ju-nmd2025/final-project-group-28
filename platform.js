export let platform = {
    x: 250,
    y: 230,
    w: 80,
    h: 20,

    draw() {
        push();
        fill("blue");
        rect(this.x, this.y, this.w, this.h);
        pop();
    },
};
