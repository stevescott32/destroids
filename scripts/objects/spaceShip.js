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

    let rotationRate = Math.PI / 32;  
    let rotation = Math.PI / 2;
    let imageReady = false;
    let image = new Image();
    let xSpeed = 0; 
    let ySpeed = 0; 

    image.onload = function () {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function rotateLeft(elapsedTime) {
        rotation -= rotationRate;
        if (rotation < 0) {
            rotation += 2 * Math.PI;
        }
    }
    function rotateRight(elapsedTime) {
        rotation += rotationRate;
        if (rotation > 2 * Math.PI) {
            rotation -= 2 * Math.PI;
        }
    }

    function update(elapsedTime) {
        spec.center.x -= xSpeed; 
        spec.center.y -= ySpeed; 
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

    function moveUp(elapsedTime) {
        xSpeed += Math.cos(rotation) * spec.thrust; 
        ySpeed += Math.sin(rotation) * spec.thrust; 
    }

    function moveDown(elapsedTime) {
        //spec.speed -= spec.boostSpeed;
    }

    function moveTo(pos) {
        spec.center.x = pos.x;
        spec.center.y = pos.y;
    }

    let api = {
        update: update,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        moveUp: moveUp,
        moveDown: moveDown,
        moveTo: moveTo,
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; }
    };

    return api;
}
