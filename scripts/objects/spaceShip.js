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
    let crashed = false; 

    image.onload = function () {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function startGame() {
        rotation = Math.PI / 2;
        xSpeed = 0; 
        ySpeed = 0; 
        spec.center = { x: spec.canvasWidth / 2, y: spec.canvasHeight / 2};
        crashed = false; 
    }

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

    function update(elapsedTime) {
        spec.center.x -= xSpeed * (elapsedTime / 100); 
        spec.center.y -= ySpeed * (elapsedTime / 100); 
        if(spec.center.x < 0) 
        {
            spec.center.x = spec.canvasWidth; 
        }
        else if(spec.center.x > spec.canvasWidth) {
            spec.center.x = 0; 
        }
        else if(spec.center.y < 0) 
        {
            spec.center.y = spec.canvasHeight; 
        }
        else if(spec.center.y > spec.canvasHeight) {
            spec.center.y = 0; 
        }
    }

    function thrust(elapsedTime) {
        xSpeed += Math.cos(rotation) * spec.thrust; 
        if(xSpeed > MAX_SPEED) {
            xSpeed -= Math.cos(rotation) * spec.thrust; 
        }
        else if(xSpeed < -1 * MAX_SPEED) {
            xSpeed -= Math.cos(rotation) * spec.thrust; 
        }
        ySpeed += Math.sin(rotation) * spec.thrust; 
        if(ySpeed > MAX_SPEED) {
            ySpeed -= Math.sin(rotation) * spec.thrust; 
        }
        else if(ySpeed < -1 * MAX_SPEED) {
            ySpeed -= Math.sin(rotation) * spec.thrust; 
        }
        // console.log(xSpeed); console.log(ySpeed); 
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

    let api = {
        update: update,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        thrust: thrust,
        moveTo: moveTo,
        startGame: startGame,
        shoot: shoot,
//        get crashed() { return crashed; },
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; },
        get radius() { return spec.radius; }
    };

    return api;
}
