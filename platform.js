// platform.js
export let platform = {
  x: 250,
  y: 230,
  w: 80,
  h: 20,
  dy: 0,
  activated: false,

  update(floor) {
    // Apply vertical movement
    if (this.dy !== 0) {
      this.y += this.dy;
    }
    // Stop at the floor
    if (this.y + this.h > floor) {
      this.y = floor - this.h;
      this.dy = 0;
      // activated stays true so it doesn't restart
    }
  },

  draw() {
    push();
    fill("blue");
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
};
