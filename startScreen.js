export StartScreen {

function setup() {
  createCanvas(400, 400);

  background(255, 150, 250);

  strokeWeight(6);
  rect(85, 150, 230, 70);
}

function draw() {
  textSize(22);
  text("START", 163, 195);
}

function mousePressed() {
  if (mouseX > 85 && mouseX < 315 && mouseY > 150 && mouseY < 220);
}
}