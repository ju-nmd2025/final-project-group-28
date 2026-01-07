class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    if (this.type === "breakable") {
      fill(255, 0, 0); // RED
    } else {
      fill(200, 255, 0); // default
    }
    rect(this.x, this.y, this.w, this.h);
  }
}

export { Platform };
