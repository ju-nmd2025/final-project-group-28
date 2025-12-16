export class EndScreen {
  constructor(retryCallback) {
    this.retryCallback = retryCallback;

    // retry button geometry (centered)
    this.x = 85;
    this.y = 150;
    this.w = 230;
    this.h = 70;
  }

  draw() {
    push();
    background(255, 150, 250);

    // Title
    textAlign(CENTER, CENTER);
    noStroke();
    fill(255);
    textSize(44);
    text("Game Over", width / 2, height * 0.25);

    // Draw retry button
    stroke(0);
    strokeWeight(2);
    fill(255, 255, 255);
    rect(this.x, this.y, this.w, this.h, 40);

    // Label
    noStroke();
    fill(0);
    textSize(18);
    text(
      "Retry",
      this.x + this.w / 2,
      this.y + this.h / 2
    );

    pop();
  }

 handleClick(mx, my) {
    // check if click is inside button
    if (
      mx >= this.x &&
      mx <= this.x + this.w &&
      my >= this.y &&
      my <= this.y + this.h
    ) {
      this.retryCallback();
      return true;
    }
    return false;
  }
}

export {EndScreen};