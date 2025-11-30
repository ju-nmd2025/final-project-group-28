import Platforms from "./platform";
import { Character } from "./character";

let canvasWidth = 400;
let canvasHeight = 400;
let floor = 300;
let character = new Character(50, 50, 50, 50);
let platforms = [];
let vy = 0; //vertical speed, aka up/down
let prevY = 0;//previous frame, keep track of each frame to prevent fall troughs


function setup() {
    createCanvas(canvasWidth, canvasHeight);

     platforms.push(new Platform(100, 200, 100, 10));//platform one etc.
    platforms.push(new Platform(250, 150, 120, 10));
    platforms.push(new Platform(50, 100, 80, 10));
}

// Obstacle / Spike / Death// Why do I have this?
function drawObstacle() {
    push();
    fill("red");
    triangle(180, 300, 210, 240, 240, 300);
    pop();
}

function draw() {
    background(100, 100, 100);

      // Horizontal movement
  if (keyIsDown(65)) character.x -= 10; // A key is 65 // 10 is speed on the x-axis
  if (keyIsDown(68)) character.x += 10; // D key is 68 //
  character.x = constrain(character.x, 0, canvasWidth - character.w);


    prevY = character.y;//keeping track  for the draw-part
    character.draw();//draws the character 60 times per second

    for (let plat of platforms){//makes platforms plat.draw
    plat.draw();//draws all the platforms in setup
    }

     // Gravity
    vy += 1.5;//gives the bounce speed             
    character.y += vy;//gives bounce

       // ------- Platform landing (prevents tunneling) -------
    for (let plat of platforms) {//loops through all platforms
        let withinX = (character.x + character.w > plat.x) && (character.x < plat.x + plat.w);//char.right edge > plat.leftEdge // char.left edge < plat.rightEdge
        let feetPrev = prevY + character.h;//where char.feet was based on prev.char and char.Height
        let feetNow  = character.y + character.h;//where char.feet is now based on char.y and char.Height
        let platTop = plat.y;//where the top of the platform is in y-axis

        //possible landing
        if (withinX && feetPrev <= platTop && feetNow >= platTop && vy > 0) { //So, if char.js is within plat.js x-parameter // and prev.char is above or on plat.js // checks if char.feet now is ontop of plat.top //check for vertical speed
            character.y = platTop - character.h; // prevents char.js from sinking through the floor
            vy = -20; // auto-jump
            break;   // only land on first platform detected
        }
    }

   // ----- Floor collision & auto-jump -----
    if (character.y + character.h >= floor) {//check if char.feet is on floor
        character.y = floor - character.h;//anti-sink here too
        vy = -20;  // auto-jump on floor
    }

    // Floor (selfexplanitory)
    line(0, floor, canvasWidth, floor);
}
