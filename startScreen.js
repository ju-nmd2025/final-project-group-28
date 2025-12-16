export class StartScreen {
  constructor(onStart) {
    this.onStart = onStart;

    // button position and size (your values)
    this.x = 85;
    this.y = 150;
    this.w = 230;
    this.h = 70;
  }

  draw() {
    // background of start screen
    background(255, 150, 250);

    // draw button
    stroke(0)
    strokeWeight(1);
    fill(255, 255, 255);
    rect(this.x, this.y, this.w, this.h, 40);

    // text
    noStroke();
    fill(0);
    textSize(22);
    text("START", this.x + 78, this.y + 45);
  }

  mousePressed(mx, my) {
    // check if click is inside the button
    if (
      mx > this.x &&
      mx < this.x + this.w &&
      my > this.y &&
      my < this.y + this.h
    ) {
      if (typeof this.onStart === "function") {
        this.onStart();
      }
      return true;
    }
    return false;
  }
}
