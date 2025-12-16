import Platform from "./platform";
import { Character } from "./character";
import { StartScreen } from "./startScreen.js";
import { EndScreen } from "./endScreen.js";

let startScreen;
let endScreen;
let currentScreen = "start";

let canvasWidth = 400;
let canvasHeight = 400;
let floor = 300;
let character;
let platforms = []; //this is the platforms array. It contains every platform
let vy = 0; //vertical speed, aka up/down let prevY = 0;//previous frame, keep track of each frame to prevent fall troughs
let prevY = 0; //previous frame what
let lastLandedPlatform = null; //detect what platform char last landed on
let lastPlatX = 100; //starting x of last plat //remembers the x of the newest respawn to prevent impossible jumps

// Platform types
const TYPE_NORMAL = "normal";
const TYPE_BREAKABLE = "breakable";
const TYPE_MOVING = "moving";
//probabilities// sum to 1.0
const PROB_NORMAL = 0.7;
const PROB_MOVING = 0.2;
const PROB_BREAKABLE = 0.1;

const gravity = 1.5; //redifined gravity jumps to create more complex expressions
const jumpVy = -20; //jumpvelocity
const MIN_GAP = 100; //Platform spacing minimum
const MAX_GAP = 120; //Maximum
const shiftThreshold = canvasHeight / 2; // upper half of canvas
const scrollSpeed = 6; // px per frame

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
  p2.vx = 2; //speed for moving platforms
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
  if (keyIsDown(65)) character.x -= 10; // A key is 65 // 10 is speed on the x-axis
  if (keyIsDown(68)) character.x += 10; // D key is 68 //
  character.x = constrain(character.x, 0, canvasWidth - character.w);

  prevY = character.y; //keeping track for the draw-part

  // Gravity
  vy += gravity; //gives the bounce speed
  character.y += vy; //gives bounce

  //update platforms
  //index is the number in the array: the loop goes backwards to prevent breakage:
  for (let i = platforms.length - 1; i >= 0; i--) {
    //Index never is above 0 so it never stops //--i means the loop is backwards
    const p = platforms[i]; //p is current platform with i a number from array//array indexing= [i]

    //skip broken platforms
    if (p.removed) {
      //checks if a removed platform exists
      platforms.splice(i, 1); //removes 1 item from the array aka removes current platform
      continue; //stop and move on
    }

    //moving platform behaviour
    if (p.type === TYPE_MOVING) {
      //they're the same
      //ensure vx exists// vx- velocity on the x-axis
      if (typeof p.vx === "undefined") p.vx = -2; //if vx is undefined it will be randomized
      p.x += p.vx; //moving the plat based on the speed
      //edgebounce
      if (p.x <= 0) {
        p.x = 0;
        p.vx *= -1;
      } //px= plats hirizontal position // check if it's past the left wall // if that is true it will put it at the wall and sent it the other way
      if (p.x + p.w >= canvasWidth) {
        p.x = canvasWidth - p.w;
        p.vx *= -1;
      } // same but different, because the left only checks left, the right checks everything
    }

    // Breakable platform crumble timer
    if (p.type === TYPE_BREAKABLE && p.brokenTimer > 0) {
      p.brokenTimer -= 1; //the timer is one
      if (p.brokenTimer <= 0) p.removed = true; //if the time is up//remove crumble
    }
  }

  // --- Smooth camera/world scroll ---
  if (character.y < shiftThreshold) {
    // check if  char is above halfCanvas
    const dy = shiftThreshold - character.y; //How far above
    const shift = Math.min(dy, scrollSpeed); //scrollspeed

    for (let p of platforms) p.y += shift; //moves  platform "shift" pixels
    floor += shift; //shifts floor
    character.y += shift; // keep character in view
  }

  character.draw(); //draws the character 60 times per second
  for (let plat of platforms) plat.draw(); //makes platforms plat.draw
  //draws all the platforms in setup

  // ------- Platform landing (prevents tunneling) -------
  let landedThisFrame = false;
  lastLandedPlatform = null;

  for (let plat of platforms) {
    //loops through all platforms exept breaking plats
    if (plat.removed) continue; //skip
    if (plat.type === TYPE_BREAKABLE && plat.broken) continue; //skip

    let withinX =
      character.x + character.w > plat.x && character.x < plat.x + plat.w; //char.right edge > plat.leftEdge // char.left edge < plat.rightEdge
    let feetPrev = prevY + character.h; //where char.feet was based on prev.char and char.Height
    let feetNow = character.y + character.h; //where char.feet is now based on char.y and char.Height
    let platTop = plat.y; //where the top of the platform is in y-axis

    //possible landing
    if (withinX && feetPrev <= platTop && feetNow >= platTop && vy > 0) {
      //So, if char.js is within plat.js x-parameter // and prev.char is above or on plat.js // checks if char.feet now is ontop of plat.top //check for vertical speed character.y = platTop - character.h; // prevents char.js from sinking through the floor
      character.y = platTop - character.h; //char on top snap

      //special behaviours
      if (plat.type === TYPE_BREAKABLE) {
        vy = jumpVy; //char can jump here
        plat.broken = true;
        plat.brokenTimer = 12; //frames until fallthrough
      } else {
        vy = jumpVy; // auto-jump// normal behaviour
      }

      landedThisFrame = true; //checks if char landed
      lastLandedPlatform = plat; //on which platform
      break; //exiting loop
    }
  }

  if (!lastLandedPlatform && character.y + character.h >= floor) {
    character.y = floor - character.h;
    vy = jumpVy;
  }

  if (character.y + canvasHeight) {
    endGame();
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

  let highestY = Math.min(...platforms.map((p) => p.y)); //find highest y on screen
  while (highestY > -MAX_GAP) {
    // spawn platforms above canvas
    const gap = Math.floor(random(MIN_GAP, MAX_GAP + 1)); //random gap
    const width = Math.floor(random(50, 120)); // random width
    const maxDX = 100; //max horizontal distance
    const minX = Math.max(0, lastPlatX - maxDX); //not of left edge
    const maxX = Math.min(canvasWidth - width, lastPlatX + maxDX); //not of right
    const x = Math.floor(random(minX, maxX + 1)); //random x within that

    let newPlat = new Platform(x, highestY - gap, width, 10); //create new plat
    newPlat.visited = false; //reset so char can jump on it
    newPlat.removed = false;
    newPlat.broken = false;
    newPlat.brokenTimer = 0;

    //assign random type -----
    const r = random();
    if (r < PROB_NORMAL) {
      newPlat.type = TYPE_NORMAL;
    } else if (r < PROB_NORMAL + PROB_MOVING) {
      newPlat.type = TYPE_MOVING;
      newPlat.vx = random([-2, -1, 1, 2]);
    } else {
      newPlat.type = TYPE_BREAKABLE;
      newPlat.broken = false;
    }

    platforms.push(newPlat); //add to platformes array
    highestY = newPlat.y; //update highest plat
    lastPlatX = x; //remeber the new x
  }
}

function keyPressed() {
  if (currentScreen === "start") {
    if (key === " " || key === "Enter") startGame();
  } else if (currentScreen === "end") {
    if (key === " " || key === "Enter") retryGame();
  }
}

// game keys (if you want to use keyPressed rather than keyIsDown

/* -------------------------
   Game start / reset helpers
   ------------------------- */
function startGame() {
  currentScreen = "game";
  initGameState();
}

function endGame() {
  currentScreen = "end";
  // freeze game state (we simply top updating because draw() returs early for 'end')
}

function retryGame() {
  currentScreen = "game";
  initGameState();
}

function initGameState() {
  // reset physics & world
  floor = 300;
  vy = 0;
  prevY = 0;
  lastLandedPlatform = null;
  lastPlatx = 100;

  // create player
  character = new Chracter(50, 50, 50, 50);

  // initial platforms (seed)
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
