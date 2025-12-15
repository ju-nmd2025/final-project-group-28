export class EndScreen {
  constructor(onRetry, options = {}) {
    this.onRetry = onRetry;

    // retry button geometry (centered)
    this.buttonX = 85;
    this.buttonY = 150;
    this.buttonW = 230;
    this.buttonH = 70;

    this.title = options.title ?? "Game Over";
  }

  draw() {
    push();
    background(255, 150, 250);

    // Title
    textAlign(CENTER, CENTER);
    noStroke();
    fill(255);
    textSize(44);
    text(this.title, width / 2, height * 0.25);

    // Draw retry button
    stroke(0);
    strokeWeight(2);
    fill(255, 255, 255);
    rect(this.buttonX, this.buttonY, this.buttonW, this.buttonH, 40);

    // Label
    noStroke();
    fill(0);
    textSize(18);
    text(
      "Retry",
      this.buttonX + this.buttonW / 2,
      this.buttonY + this.buttonH / 2
    );

    pop();
  }

  mousePressed(mx, my) {
    if (
      mx > this.buttonX &&
      mx < this.buttonX + this.buttonW &&
      my > this.buttonY &&
      my < this.buttonY + this.buttonH
    ) {
      if (typeof this.onRetry === "function") this.onRetry();
      return true;
    }
    return false;
  }
}
