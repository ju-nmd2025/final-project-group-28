

@@ -9,25 +9,19 @@ let platforms = [];
let vy = 0; //vertical speed, aka up/down
let prevY = 0;//previous frame, keep track of each frame to prevent fall troughs

const shiftOnLand = 40;           // how much all platforms move down on a new-platform landing
let lastLandedPlatform = null;    // remember last platform we landed on to avoid repeated shifts

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
     platforms.push(new Platform(100, 200, 110, 10));//platform one etc.
    platforms.push(new Platform(280, 125, 100, 10));
    platforms.push(new Platform(50, 50, 80, 10));
}

function draw() {
    background(100, 100, 100);
    background(255, 150, 250);

      // Horizontal movement
  if (keyIsDown(65)) character.x -= 10; // A key is 65 // 10 is speed on the x-axis


@@ -59,15 +53,40 @@
            vy = -20; // auto-jump
            break;   // only land on first platform detected
        }
        // --- NEW: only trigger a global shift if this is a different platform than last frame ---
            if (plat !== lastLandedPlatform) {
                // move all platforms down by shiftOnLand
                for (let p of platforms) {
                    p.y += shiftOnLand;
                    // recycle platform when it moves off bottom
                    if (p.y > canvasHeight) {
                        p.y = -10; // respawn above canvas
                    }
                }
                // move the character down the same amount so it visually stays on the landed platform
                character.y += shiftOnLand;

                // record this platform as the last landed on
                lastLandedPlatform = plat;
            }

            landedThisFrame = true;
            break; // only land on the first platform detected
        }
    }

    // If we didn't land this frame, clear lastLandedPlatform so we can detect a new landing next time
    if (!landedThisFrame) {
        lastLandedPlatform = null;
    }

   // ----- Floor collision & auto-jump -----
    if (character.y + character.h >= floor) {//check if char.feet is on floor
        character.y = floor - character.h;//anti-sink here too
        vy = -20;  // auto-jump on floor
    }

    // Floor (selfexplanitory)
    line(0, floor, canvasWidth, floor);
}
