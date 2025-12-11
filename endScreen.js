export class EndScreen {

function setup() {
  createCanvas(400, 400);

  background(255, 150, 250);

  strokeWeight(6);

  rect(70, 80, 250, 250);
}

function draw() {
  textSize(20);
  text("you died", 160, 170);

  rect(96, 225, 200, 70);
  text("restart game", 140, 268);
}
}