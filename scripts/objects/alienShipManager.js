Game.objects.AlienShipManager = function (spec) {
    'use strict';
    let ships = []; 

    function createNewShip(shipSpec) {
        let imageReady = false;
        let image = new Image();
        image.onload = function () {
            imageReady = true;
        };
        image.src = shipSpec.imageSrc;

        let lastShot = 0; 
        let isDead = false; 

        // determine where the ship is and return a spec with 
        // the current point in the direction of the ship 
        function shoot() {
            let laserCenter = {
                x: shipSpec.center.x,
                y: shipSpec.center.y
            };
            let laserSize = {
                width: 25,
                height: 15
            };
            let laserRotation = shipSpec.rotation; 
            let laserSpec = {
                center: laserCenter,
                size: laserSize,
                speed: 1,
                rotation: laserRotation
            };
            return laserSpec;
        }

        // the ship has been hit
        function crash() {
            isDead = true; 
            let audio = new Audio(shipSpec.audioSrc);
            audio.play(); 
        }

        function update(elapsedTime) {
            // move according to elapsed time 
            shipSpec.rotation += shipSpec.rotationRate * (elapsedTime / 100);  
            shipSpec.center.x -= shipSpec.xSpeed * (elapsedTime / 100);
            shipSpec.center.y -= shipSpec.ySpeed * (elapsedTime / 100);
            // wrap the ship positon on 2X canvas height and width 
            if (shipSpec.center.x < (-1 * Game.graphics.canvas.width)) {
                shipSpec.center.x = Game.graphics.canvas.width;
            }
            else if (shipSpec.center.x > 2 * Game.graphics.canvas.width) {
                shipSpec.center.x = 0;
            }
            else if (shipSpec.center.y < (-1 * Game.graphics.canvas.height)) {
                shipSpec.center.y = Game.graphics.canvas.height;
            }
            else if (shipSpec.center.y > 2 * Game.graphics.canvas.height) {
                shipSpec.center.y = 0;
            }

            // shoot a laser
            if(performance.now() - lastShot > shipSpec.fireRate * 1000 && !isDead
            && shipSpec.center.x > 0 && shipSpec.center.y > 0
            && shipSpec.center.x < Game.graphics.canvas.width && shipSpec.center.y < Game.graphics.canvas.height) {
                spec.lasers.addLaser(shoot()); 
                lastShot = performance.now(); 
            }
        }

        let api = {
            update: update,
            crash: crash,
            isDead: isDead,
            get isDead() { return isDead; }, 
            get imageReady() { return imageReady; },
            get rotation() { return shipSpec.rotation; },
            get image() { return image; },
            get center() { return shipSpec.center; },
            get size() { return shipSpec.size; },
            get radius() { return shipSpec.radius; }
        }

        return api; 
    }

    function makeSmallShip() {
        let firstShipRotation = Random.nextGaussian(Math.PI, (Math.PI / 2)); 
        ships.push(createNewShip({
            imageSrc: 'resources/images/ships/greenShip.png',
            audioSrc: 'resources/audio/zapsplat_explosion.mp3',
            center: { x: Random.nextGaussian(Game.graphics.canvas.width, 10), 
                y: Random.nextGaussian(Game.graphics.canvas.height, 10)},
            size: { width: 80, height: 80 },
            xSpeed: Random.nextGaussian(-15, 3) * Math.cos(firstShipRotation),
            ySpeed: Random.nextGaussian(15, 3) * Math.sin(firstShipRotation), 
            radius: 35,
            rotationRate: 1 * Math.PI / 16, // radians per second
            rotation: firstShipRotation, 
            crashed: false,
            fireRate: 1 // seconds
        })); 
    }

    function makeLargeShip() {
        let secondShipRotation = Random.nextGaussian(Math.PI, (Math.PI / 2)); 
        ships.push(createNewShip({
            imageSrc: 'resources/images/ships/greyShip.png',
            audioSrc: 'resources/audio/zapsplat_explosion2.mp3',
            center: { x: Random.nextGaussian(Game.graphics.canvas.width, 10), 
                y: Random.nextGaussian(Game.graphics.canvas.height, 10)},
            size: { width: 50, height: 50 },
            xSpeed: Random.nextGaussian(20, 3) * Math.cos(secondShipRotation),
            ySpeed: Random.nextGaussian(-20, 3) * Math.sin(secondShipRotation), 
            radius: 20,
            rotationRate: 1 * Math.PI / 16, // radians per second
            rotation: secondShipRotation,
            crashed: false,
            fireRate: 0.5 // seconds
        })); 
    }

    function startGame() {
        ships = []; 
        makeSmallShip();
        makeLargeShip(); 
    }

    function update(elapsedTime) {
        ships = ships.filter(ship => !ship.isDead);
        for(let s = 0; s < ships.length; s++) {
            let ship = ships[s]; 
            ship.update(elapsedTime); 
        }
        if(ships.length == 0) {
            makeLargeShip();
            makeSmallShip(); 
        }
    }
    
    let api = {
        update: update,
        startGame: startGame,
        get ships() { return ships; }
    };

    return api;
}
