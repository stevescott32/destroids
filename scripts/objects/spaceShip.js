// --------------------------------------------------------------
//
// Creates a Image object, with functions for managing state.
//
// spec = {
//    imageSrc: ,   // Web server location of the image
//    center: { x: , y: },
//    size: { width: , height: }
//    rotation: // rotation
// }
//
// --------------------------------------------------------------
Game.objects.SpaceShip = function (spec) {
    'use strict';
    console.log('Initializing space ship');
    let MAX_SPEED = 200;

    let rotation = Math.PI / 2;
    let xSpeed = 0;
    let ySpeed = 0;
    let imageReady = false;
    let image = new Image();
    let lastHyperSpaceTime = 0;
    let hyperspaceInterval = spec.hyperspaceInterval * 1000 // miliseconds

    image.onload = function () {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function rotateLeft(elapsedTime) {
        rotation -= spec.rotationRate * (elapsedTime / 100);
        if (rotation < 0) {
            rotation += 2 * Math.PI;
        }
    }
    function rotateRight(elapsedTime) {
        rotation += spec.rotationRate * (elapsedTime / 100);
        if (rotation > 2 * Math.PI) {
            rotation -= 2 * Math.PI;
        }
    }

    function thrust(elapsedTime) {
        xSpeed += Math.cos(rotation) * spec.thrust;
        if (xSpeed > MAX_SPEED) {
            xSpeed -= Math.cos(rotation) * spec.thrust;
        }
        else if (xSpeed < -1 * MAX_SPEED) {
            xSpeed -= Math.cos(rotation) * spec.thrust;
        }
        ySpeed += Math.sin(rotation) * spec.thrust;
        if (ySpeed > MAX_SPEED) {
            ySpeed -= Math.sin(rotation) * spec.thrust;
        }
        else if (ySpeed < -1 * MAX_SPEED) {
            ySpeed -= Math.sin(rotation) * spec.thrust;
        }
    }

    // determine where the ship is and return a spec with 
    // the current point in the direction of the ship 
    function shoot() {
        let laserCenter = {
            x: spec.center.x,
            y: spec.center.y
        };
        let laserSize = {
            width: 25,
            height: 15
        };
        let laserRotation = rotation;
        let laserSpec = {
            center: laserCenter,
            size: laserSize,
            speed: 1,
            rotation: laserRotation
        };
        return laserSpec;
    }

    function moveTo(pos) {
        spec.center.x = pos.x;
        spec.center.y = pos.y;
    }

    function detectCircleCollision(objectToAvoid, center, radius) {
        let distanceSquared = Math.pow(center.x - objectToAvoid.center.x, 2) + Math.pow(center.y - objectToAvoid.center.y, 2);
        let radiusSum = objectToAvoid.radius + radius;
        if (!objectToAvoid.remove && radiusSum * radiusSum > distanceSquared) {
            return true;
        }
        else {
            return false;
        }
    }

    function calculateSafety(objectsToAvoid, xPos, yPos) {
        let safetyScore = 0;

        for (let a = 0; a < objectsToAvoid.length; a++) {
            let avoid = objectsToAvoid[a];
            let additionalSafety = Math.pow(xPos - avoid.center.x, 2) + Math.pow(yPos - avoid.center.y, 2);
            if (!isNaN(additionalSafety)) {
                safetyScore += additionalSafety;
            }
            // detect if there is an asteroid within 2 * radius of the ship and break 
            if (detectCircleCollision(avoid, { x: xPos, y: yPos }, spec.radius * 2)) {
                safetyScore = 0;
                break;
            }
        }

        let api = {
            get xPos() { return xPos; },
            get yPos() { return yPos; },
            get safetyScore() { return safetyScore; }
        }

        return api;
    }

    
    function hyperspace(objectsToAvoid) {
        let possibleLocations = [];
        // calculate the danger of each space ship location
        for (let x = 2 * spec.size.width; x < spec.canvasWidth - (2 * spec.size.width); x += 2 * spec.size.width) {
            for (let y = 2 * spec.size.height; y < spec.canvasHeight - (2 * spec.size.height); y += 2 * spec.size.height) {
                possibleLocations.push(calculateSafety(objectsToAvoid, x, y));
            }
        }

        // set the location to the least dangerous spot 
        let mostSafe = { x: 500, y: 500, safetyScore: 0 };
        for (let d = 0; d < possibleLocations.length; d++) {
            if (possibleLocations[d].safetyScore > mostSafe.safetyScore) {
                mostSafe = possibleLocations[d];
            }
        }
        spec.center.x = mostSafe.xPos;
        spec.center.y = mostSafe.yPos;
        xSpeed = 0;
        ySpeed = 0;
    }
    
    function playerHyperspace(objectsToAvoid) {
        if (performance.now() - lastHyperSpaceTime > hyperspaceInterval) {
            lastHyperSpaceTime = performance.now();
            hyperspace(objectsToAvoid); 
        }
    }


    function newLifeHyperspace(objectsToAvoid) {
        hyperspace(objectsToAvoid); 
    }

    function startGame() {
        rotation = Math.PI / 2;
        xSpeed = 0;
        ySpeed = 0;
        spec.center = { x: spec.canvasWidth / 2, y: spec.canvasHeight / 2 };
    }

    function update(elapsedTime) {
        spec.center.x -= xSpeed * (elapsedTime / 100);
        spec.center.y -= ySpeed * (elapsedTime / 100);
        if (spec.center.x < 0) {
            spec.center.x = spec.canvasWidth;
        }
        else if (spec.center.x > spec.canvasWidth) {
            spec.center.x = 0;
        }
        else if (spec.center.y < 0) {
            spec.center.y = spec.canvasHeight;
        }
        else if (spec.center.y > spec.canvasHeight) {
            spec.center.y = 0;
        }
    }

    let api = {
        update: update,
        startGame: startGame,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        thrust: thrust,
        moveTo: moveTo,
        shoot: shoot,
        newLifeHyperspace: newLifeHyperspace,
        playerHyperspace: playerHyperspace,
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; },
        get radius() { return spec.radius; }
    };

    return api;
}
