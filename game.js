import Platforms from "./platform";
import { Character } from "./character";

let canvasWidth = 400;
let canvasHeight = 400;
let floor = 300;
let character = new Character(50, 50, 50, 50);
let platforms = [];
let vy = 0;//vertical speed, aka up/down let prevY = 0;//previous frame, keep track of each frame to prevent fall troughs
let prevY = 0;

//detection for Newplatform moving
const shiftOnLand = 50;//How much everything moves down
let lastLandedPlatform = null;//detect what platform char last landed on
//remembers the x of the newest respawn tp prevent impossible jumps

const MIN_GAP = 100;//Platform spacing minimum
const MAX_GAP = 120;//Maximum
const shiftThreshold = canvasHeight / 2; // upper half of canvas
const scrollSpeed = 5; // px per frame

const gravity = 1.5;//redifined gravity jumps to create more complex expressions
const jumpVy = -20; //jumpvelocity
let lastPlatX = 100;//starting x of last plat

function setup() {
    createCanvas(canvasWidth, canvasHeight);
   
    let p1 = new Platform(100, 200, 110, 10);//platform 1
    p1.visited = false;
    platforms.push(p1);

    let p2 = new Platform(280, 125, 100, 10);
    p2.visited = false;
    platforms.push(p2);

    let p3 = new Platform(50, 50, 80, 10);
    p3.visited = false;
    platforms.push(p3);
} 

function draw() { 
    background(255, 150, 250);

    // Horizontal movement 
    if (keyIsDown(65)) character.x -= 10; // A key is 65 // 10 is speed on the x-axis 
    if (keyIsDown(68)) character.x += 10; // D key is 68 // 
    character.x = constrain(character.x, 0, canvasWidth - character.w);
    
    prevY = character.y;//keeping track for the draw-part 
    
     // Gravity 
    vy += 1.5;//gives the bounce speed
    character.y += vy;//gives bounce

     // --- Smooth camera/world scroll ---
    if (character.y < shiftThreshold) {// check if  char is above halfCanvas
        const dy = shiftThreshold - character.y;//How far above
        const shift = Math.min(dy, scrollSpeed);//scrollspeed

        for (let p of platforms) {//moves  platform "shift" pixels
            p.y += shift;//defines shift
        }
        floor += shift;//shifts floor
        character.y += shift; // keep character in view
    }

    character.draw();//draws the character 60 times per second 
    for (let plat of platforms) {//makes platforms plat.draw 
        plat.draw();//draws all the platforms in setup 
    }

     // ------- Platform landing (prevents tunneling) ------- 
     let landedThisFrame = false;
     let lastLandedPlatform = null;

     for (let plat of platforms) {//loops through all platforms 
        let withinX = (character.x + character.w > plat.x) && (character.x < plat.x + plat.w);//char.right edge > plat.leftEdge // char.left edge < plat.rightEdge 
        let feetPrev = prevY + character.h;//where char.feet was based on prev.char and char.Height
        let feetNow = character.y + character.h;//where char.feet is now based on char.y and char.Height
        let platTop = plat.y;//where the top of the platform is in y-axis

     //possible landing 
        if (withinX && feetPrev <= platTop && feetNow >= platTop && vy > 0) { //So, if char.js is within plat.js x-parameter // and prev.char is above or on plat.js // checks if char.feet now is ontop of plat.top //check for vertical speed character.y = platTop - character.h; // prevents char.js from sinking through the floor 
            character.y = platTop - character.h;//char on top snap
            vy = jumpVy; // auto-jump

            landedThisFrame = true;//checks if char landed
            lastLandedPlatform = plat;//on which platform
            break;//exiting loop
        }
    }

    // ----- Floor collision & auto-jump -----
    if (character.y + character.h >= floor) {//check if char.feet is on floor 
     character.y = floor - character.h;//anti-sink here too
     vy = jumpVy; // auto-jump on floor 
    } 
    // Floor (selfexplanitory)
    line(0, floor, canvasWidth, floor); 

    //platform spawning
    let highestY = Math.min(...platforms.map(p => p.y));//find highest y on screen
        while (highestY > -MAX_GAP) { // spawn platforms above canvas
            const gap = Math.floor(random(MIN_GAP, MAX_GAP + 1));//random gap
            const width = Math.floor(random(50, 120)); // random width
            
            const maxDX = 100;//max hirizontal distance
            const minX = Math.max(0, lastPlatX - maxDX);//not of left edge
            const maxX = Math.min(canvasWidth - width, lastPlatX + maxDX);//not of right
            const x = Math.floor(random(minX, maxX + 1));//random x within that
    
            let newPlat = new Platform(x, highestY - gap, width, 10);//create new plat
            newPlat.visited = false;//reset so char can jump on it
            platforms.push(newPlat);//add to platformes array
    
            highestY = newPlat.y;//update highest plat
            lastPlatX = x;//remeber the new x
        }
    }