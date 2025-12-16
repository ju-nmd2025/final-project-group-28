import { Platform } from "./platform.js";
import { Character } from "./character.js";
import { StartScreen } from "./startScreen.js";
import { EndScreen } from "./endScreen.js";

let startScreen;
let endScreen;
let currentScreen = "start";

let canvasWidth = 400;
let canvasHeight = 400;
let floor = 300;
let character;
let platforms = [];
let vy = 0;
let prevY = 0;
let lastLandedPlatform = null;
let lastPlatX = 100;

// Platform types
const TYPE_NORMAL = "normal";
const TYPE_BREAKABLE = "breakable";
const TYPE_MOVING = "moving";

//probabilities// sum to 1.0
const PROB_NORMAL = 0.7;
const PROB_MOVING = 0.2;
const PROB_BREAKABLE = 0.1;

const gravity = 1.5;
const jumpVy = -20;
const MIN_GAP = 100;
const MAX_GAP = 120;
const shiftThreshold = canvasHeight / 2;
const scrollSpeed = 6;

function setup() {

  createCanvas(canvasWidth, canvasHeight);
  startScreen = new StartScreen(() => startGame());
  endScreen = new EndScreen(() => retryGame());
  initGameState();
}

function initGameState() {

  floor = 300;
  vy = 0;
  prevY = 0;
  lastLandedPlatform = null;
  lastPlatX = 100;

  character = new Character(50, 50, 50, 50);

  platforms = [];

  let p1 = new Platform(100, 200, 110, 10);
  p1.type = TYPE_NORMAL;
  p1.removed = false;
  platforms.push(p1);

  let p2 = new Platform(280, 125, 100, 10);
  p2.type = TYPE_MOVING;
  p2.vx = 2;
  p2.removed = false;
  platforms.push(p2);

  let p3 = new Platform(50, 50, 80, 10);
  p3.type = TYPE_BREAKABLE;
  p3.broken = false;
  p3.brokenTimer = 0;
  p3.removed = false;
  platforms.push(p3);
}

function draw() {

  if (currentScreen === "start") {
    startScreen.draw();
    return;
  }

  if (currentScreen === "end") {
    // update end screen
    endScreen.draw();
    return;
  }

  background(255, 150, 250);

  // Horizontal movement
  if (keyIsDown(65)) character.x -= 10; // A key is 65
  if (keyIsDown(68)) character.x += 10; // D key is 68
  character.x = constrain(character.x, 0, canvasWidth - character.w);

  prevY = character.y;

  // Gravity
  vy += gravity;
  character.y += vy;

  //update platforms
  for (let i = platforms.length - 1; i >= 0; i--) {
    const p = platforms[i];
    if (p.removed) {
      platforms.splice(i, 1);
      continue;
    }

    //moving platform behaviour
    if (p.type === TYPE_MOVING) {
      if (typeof p.vx === "undefined") p.vx = -2;
      p.x += p.vx;

      //edgebounce
      if (p.x <= 0) {
        p.x = 0;
        p.vx *= -1;
      }
      if (p.x + p.w >= canvasWidth) {
        p.x = canvasWidth - p.w;
        p.vx *= -1;
      }
    }

    // Breakable platform crumble timer
    if (p.type === TYPE_BREAKABLE && p.brokenTimer > 0) {
      p.brokenTimer -= 1;
      if (p.brokenTimer <= 0) p.removed = true;
    }
  }

  // --- Smooth camera/world scroll ---
  if (character.y < shiftThreshold) {
    const dy = shiftThreshold - character.y;
    const shift = Math.min(dy, scrollSpeed);

    for (let p of platforms) p.y += shift;
    floor += shift;
    character.y += shift;
  }

  character.draw();
  for (let plat of platforms) plat.draw();

  // Platform landing (prevents tunneling)
  let landedThisFrame = false;
  lastLandedPlatform = null;

  for (let plat of platforms) {
    //loops through all platforms
    if (plat.removed) continue;
    if (plat.type === TYPE_BREAKABLE && plat.broken) continue;

    let withinX = character.x + character.w > plat.x && character.x < plat.x + plat.w;
    let feetPrev = prevY + character.h;
    let feetNow = character.y + character.h;
    let platTop = plat.y;

    // Possible landing
    if (withinX && feetPrev <= platTop && feetNow >= platTop && vy > 0) {
      character.y = platTop - character.h; //snap to platform

      //special behaviours
      if (plat.type === TYPE_BREAKABLE) {
        vy = jumpVy;
        plat.broken = true;
        plat.brokenTimer = 12; //frames until fallthrough
      } else {
        vy = jumpVy;
      }

      landedThisFrame = true;
      lastLandedPlatform = plat;
      break; 
    }
  }

  if (character.y > canvasHeight) {
    endGame();
  }

 if (!lastLandedPlatform && character.y + character.h >= floor) {
    character.y = floor - character.h;
    vy = jumpVy;
  }

  // Floor (selfexplanitory)
  line(0, floor, canvasWidth, floor);

  //platform spawning
  if (platforms.length === 0) {
    let newPlat = new Platform(100, 200, 110, 10);
    newPlat.type = TYPE_NORMAL;
    newPlat.removed = false;
    platforms.push(newPlat);
  }

  let highestY = Infinity;

// find the highest (smallest y) platform
for (let p of platforms) {
  if (p.y < highestY) {
    highestY = p.y;
  }
}

while (highestY > -MAX_GAP) {

    // spawn platforms above canvas
    const gap = Math.floor(random(MIN_GAP, MAX_GAP + 1)); //random gap
    const width = Math.floor(random(50, 120)); // random width
    const maxDX = 100; //max horizontal distance
    const minX = Math.max(0, lastPlatX - maxDX); //not of left edge
    const maxX = Math.min(canvasWidth - width, lastPlatX + maxDX); //not of right
    const x = Math.floor(random(minX, maxX + 1)); //random x within that

    let newPlat = new Platform(x, highestY - gap, width, 10);
    newPlat.visited = false;
    newPlat.removed = false;
    newPlat.broken = false;
    newPlat.brokenTimer = 0;

    //assign random type
    const r = random();
    if (r < PROB_NORMAL) {
      newPlat.type = TYPE_NORMAL;
    } else if (r < PROB_NORMAL + PROB_MOVING) {
      newPlat.type = TYPE_MOVING;
    } else {
      newPlat.type = TYPE_BREAKABLE;
      newPlat.broken = false;
    }

    platforms.push(newPlat); //add to array
    highestY = newPlat.y; //update highest
    lastPlatX = x; //remeber the new x
  }
}

function mouseClicked() {
  if (currentScreen === "start") {
    startScreen.handleClick(mouseX, mouseY);
  } else if (currentScreen === "end") {
    endScreen.handleClick(mouseX, mouseY);
  }
}

//Game start / reset
function startGame() {
  currentScreen = "game";
  initGameState();
}

function endGame() {
  currentScreen = "end";
  
}

function retryGame() {
  currentScreen = "game";
  initGameState();
}