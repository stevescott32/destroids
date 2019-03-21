Game.objects.AlienShipManager = function (spec) {
    'use strict';
    console.log('Initializing alien ship');
    let MAX_SPEED = 200;
    let ships = []; 

    function createNewShip(shipSpec) {
        let imageReady = false;
        let image = new Image();

        let lastShot = 0; 

        image.onload = function () {
            imageReady = true;
        };
        image.src = shipSpec.imageSrc;

        // determine where the ship is and return a spec with 
        // the current point in the direction of the ship 
        function shoot() {
            console.log('Shooting a new alien laser'); 
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

        function update(elapsedTime) {
            shipSpec.rotation += shipSpec.rotationRate * (elapsedTime / 100);  
            shipSpec.center.x -= shipSpec.xSpeed * (elapsedTime / 100);
            shipSpec.center.y -= shipSpec.ySpeed * (elapsedTime / 100);
            if (shipSpec.center.x < (-1 * shipSpec.canvasWidth)) {
                shipSpec.center.x = shipSpec.canvasWidth;
            }
            else if (shipSpec.center.x > 2 * shipSpec.canvasWidth) {
                shipSpec.center.x = 0;
            }
            else if (shipSpec.center.y < (-1 * shipSpec.canvasHeight)) {
                shipSpec.center.y = shipSpec.canvasHeight;
            }
            else if (shipSpec.center.y > 2 * shipSpec.canvasHeight) {
                shipSpec.center.y = 0;
            }

            // shoot a laser
            if(performance.now() - lastShot > shipSpec.fireRate * 1000) {
                spec.lasers.addLaser(shoot()); 
                lastShot = performance.now(); 
            }
        }

        let api = {
            update: update,
            get imageReady() { return imageReady; },
            get rotation() { return shipSpec.rotation; },
            get image() { return image; },
            get center() { return shipSpec.center; },
            get size() { return shipSpec.size; },
            get radius() { return shipSpec.radius; }
        }

        return api; 
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

    function startGame() {
        ships = []; 
        let firstShipRotation = Random.nextGaussian(Math.PI, (Math.PI / 2)); 
        ships.push(createNewShip({
            imageSrc: 'resources/images/smallAlien.png',
            center: { x: Random.nextGaussian(spec.canvasWidth, 10), 
                y: Random.nextGaussian(spec.canvasHeight, 10)},
            size: { width: 80, height: 80 },
            xSpeed: Random.nextGaussian(-15, 3) * Math.cos(firstShipRotation),
            ySpeed: Random.nextGaussian(15, 3) * Math.sin(firstShipRotation), 
            radius: 35,
            canvasHeight: spec.canvasHeight,
            canvasWidth: spec.canvasWidth,
            rotationRate: 1 * Math.PI / 16, // radians per second
            rotation:firstShipRotation, 
            crashed: false,
            fireRate: 1 // seconds
        })); 
        
        let secondShipRotation = Random.nextGaussian(-Math.PI, (Math.PI / 2)); 
        ships.push(createNewShip({
            imageSrc: 'resources/images/largeAlien.png',
            center: { x: Random.nextGaussian(spec.canvasWidth, 10), 
                y: Random.nextGaussian(spec.canvasHeight, 10)},
            size: { width: 50, height: 50 },
            xSpeed: Random.nextGaussian(20, 3) * Math.cos(firstShipRotation),
            ySpeed: Random.nextGaussian(-20, 3) * Math.sin(firstShipRotation), 
            radius: 20,
            canvasHeight: spec.canvasHeight,
            canvasWidth: spec.canvasWidth,
            rotationRate: 1 * Math.PI / 16, // radians per second
            rotation:secondShipRotation, 
            crashed: false,
            fireRate: 2 // seconds
        })); 

    }

    function update(elapsedTime) {
        for(let s = 0; s < ships.length; s++) {
            let ship = ships[s]; 
            ship.update(elapsedTime); 
        }
    }
    
    let api = {
        update: update,
        startGame: startGame,
        get ships() { return ships; }
    };

    return api;
}
