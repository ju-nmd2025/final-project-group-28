// -----------------------------
// Character Class
// -----------------------------
class Character {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.vy = 0; // vertical velocity
    this.gravity = 1; // gravity per frame
  }

  draw() {
    push();
    fill("orange");
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}

// -----------------------------
// Scene Variables
// -----------------------------
let canvasWidth = 400;
let canvasHeight = 400;
let floor = 300;
let character = new Character(50, 50, 50, 50);

const moveSpeed = 5; // horizontal speed
const jumpSpeed = -15; // upward jump velocity
const tolerance = 5; // pixel tolerance for platform standing/jump

// -----------------------------
// Multiple Platforms
// -----------------------------
let platforms = [
  { x: 250, y: 230, w: 80, h: 20 },
  { x: 100, y: 180, w: 100, h: 20 },
  { x: 300, y: 120, w: 60, h: 20 },
];

// -----------------------------
// Helper Functions
// -----------------------------
function isOnAnyPlatform() {
  for (let plat of platforms) {
    const horizontallyAligned =
      character.x + character.w > plat.x && character.x < plat.x + plat.w;
    const verticallyAligned =
      character.y + character.h >= plat.y - tolerance &&
      character.y + character.h <= plat.y + tolerance;

    if (horizontallyAligned && verticallyAligned) {
      return plat; // return the platform character is standing on
    }
  }
  return null;
}

// -----------------------------
// p5 Setup
// -----------------------------
function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

// -----------------------------
// p5 Draw Loop
// -----------------------------
function draw() {
  background(100);

  // --- Horizontal movement ---
  if (keyIsDown(65)) {
    // 'A' key
    character.x -= moveSpeed;
  }
  if (keyIsDown(68)) {
    // 'D' key
    character.x += moveSpeed;
  }

  // Keep character inside canvas
  character.x = constrain(character.x, 0, canvasWidth - character.w);

  // --- Gravity & vertical motion ---
  character.y += character.vy;
  character.vy += character.gravity;

  // --- Floor collision ---
  if (character.y + character.h > floor) {
    character.y = floor - character.h;
    character.vy = 0;
  }

  // --- Platform collision (snap only when falling) ---
  let standingPlat = isOnAnyPlatform();
  if (character.vy > 0 && standingPlat) {
    character.y = standingPlat.y - character.h;
    character.vy = 0;
  }

  // --- Draw all platforms ---
  for (let plat of platforms) {
    push();
    fill("blue");
    rect(plat.x, plat.y, plat.w, plat.h);
    pop();
  }

  // --- Draw character ---
  character.draw();

  // --- Draw floor line ---
  stroke(0);
  line(0, floor, canvasWidth, floor);
}

// -----------------------------
// Jump on key press
// -----------------------------
function keyPressed() {
  // Check if standing on floor
  let onFloor =
    character.y + character.h >= floor - tolerance &&
    character.y + character.h <= floor + tolerance;

  // Check if standing on any platform
  let onPlatform = isOnAnyPlatform();

  if (onFloor || onPlatform) {
    character.vy = jumpSpeed;

    // Diagonal jump
    if (keyIsDown(65)) character.x -= 10; // left
    else if (keyIsDown(68)) character.x += 10; // right
  }
}
