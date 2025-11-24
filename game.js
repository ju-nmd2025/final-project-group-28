function setup() {
    createCanvas(400, 400);
}

// Character
function drawCharacter() {
    rect(50, 50, 50, 50);
}

// Platform
function drawPlatform(x, y) {
    push();
    fill("blue");
    rect(x, y, 80, 20);
    pop();
}

// Obstacle / Spike / Death
function drawObstacle() {
    push();
    fill("red");
    triangle(180, 300, 210, 240, 240, 300);
    pop();
}

let x = 100;
let y = 100;

function draw() {
    background(100, 100, 100);

    drawCharacter();

    drawPlatform(x, y + 150);
    drawPlatform(x + 130, y + 150);

    drawObstacle();

    // Floor
    line(0, 300, 400, 300);
}
