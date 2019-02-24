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

    let rotationRate = 15;
    let speed = spec.speed;
    let rotation = 180;
    let imageReady = false;
    let image = new Image();

    image.onload = function () {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function rotateRight(elapsedTime) {
        rotation -= rotationRate;
        if (rotation < 0) {
            rotation += 360;
        }
    }
    function rotateLeft(elapsedTime) {
        rotation += rotationRate;
        if (rotation > 360) {
            rotation += 360;
        }
    }

    function update(elapsedTime) {

    }

    function moveForward(elapsedTime) {

    }

    function moveLeft(elapsedTime) {
        spec.center.x -= (spec.speed * elapsedTime);
    }

    function moveRight(elapsedTime) {
        spec.center.x += (spec.speed * elapsedTime);
    }

    function moveUp(elapsedTime) {
        spec.center.y -= (spec.speed * elapsedTime);
    }

    function moveDown(elapsedTime) {
        spec.center.y += (spec.speed * elapsedTime);
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
