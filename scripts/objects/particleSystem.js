Game.objects.ParticleSystemManager = function (managerSpec) {
    let effects = []; 

    function makeEffect(spec) {
        let nextName = 1;
        let particles = {};
        
        let image = new Image();
        let isReady = false;
        let systemTotalTime = 0; 

        image.onload = () => {
            isReady = true;
        };
        image.src = spec.imageSrc;

        function create() {
            let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
            let p = {
                center: { x: spec.center.x, y: spec.center.y },
                size: { height: size, width: size },
                direction: Random.nextCircleVector(),
                speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
                rotation: 0,
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), // seconds
                alive: 0
            };

            return p;
        }

        function isDead() {
            if(systemTotalTime > spec.explosionLifetime) {
                return true;
            }
            return false; 
        }

        function update(elapsedTime) {
            let removeMe = [];

            elapsedTime = elapsedTime / 1000;
            systemTotalTime += elapsedTime; 

            for (let particle = 0; particle < spec.density; particle++) {
                particles[nextName++] = create();
            }

            Object.getOwnPropertyNames(particles).forEach(value => {
                let particle = particles[value];

                particle.alive += elapsedTime;
                particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
                particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

                particle.rotation += particle.speed / 500;

                if (particle.alive > particle.lifetime) {
                    removeMe.push(value);
                }
            });

            for (let particle = 0; particle < removeMe.length; particle++) {
                delete particles[removeMe[particle]];
            }
        }

        let api = {
            update: update,
            get image() { return image; },
            get particles() { return particles; },
            get isReady() { return isReady; },
            isDead: isDead
        };

        return api;
    }

    function createHyperspaceEffect(spaceship) {
        effects.push(makeEffect({
            center: { x: spaceship.center.x, y: spaceship.center.y },
            size: { mean: 20, stdev: 4 }, 
            speed: { mean: 400, stdev: 20 }, 
            lifetime: { mean: 0.2, stdev: 0.1 }, 
            explosionLifetime: 0.2, 
            density: 8, 
            imageSrc: "resources/images/greenBlob.png"
        })); 
    }

    function createNewLifeEffect(spaceship) {
        effects.push(makeEffect({
            center: { x: spaceship.center.x, y: spaceship.center.y },
            size: { mean: 20, stdev: 4 }, 
            speed: { mean: 400, stdev: 20 }, 
            lifetime: { mean: 0.3, stdev: 0.1 }, 
            explosionLifetime: 0.3, 
            density: 8, 
            imageSrc: "resources/images/greenBlob.png"
        })); 
    }

    function createAsteroidBreakup(asteroid) {
        let sc = asteroid.size.sizeCategory; 
        effects.push(makeEffect({
            center: { x: asteroid.center.x, y: asteroid.center.y },
            size: { mean: 10, stdev: 2 }, 
            speed: { mean: (200 * sc), stdev: 20 }, 
            lifetime: { mean: (0.4 + sc * 0.1), stdev: 0.2 }, 
            explosionLifetime: 0.4 + sc * 0.1, 
            density: sc * sc * 5, 
            imageSrc: "resources/images/smoke.png"
        })); 
    }

    function createShipExplosion(xPos, yPos) {
        effects.push(makeEffect({
            center: { x: xPos, y: yPos },
            size: { mean: 20, stdev: 4 }, 
            speed: { mean: 100, stdev: 20 }, 
            lifetime: { mean: 1, stdev: 0.5 }, 
            explosionLifetime: 1, 
            density: 10, 
            imageSrc: "resources/images/fire.png"
        })); 
    }

    function createUFOExplosion(xPos, yPos) {
        effects.push(makeEffect({
            center: { x: xPos, y: yPos },
            size: { mean: 20, stdev: 4 }, 
            speed: { mean: 100, stdev: 20 }, 
            lifetime: { mean: 1, stdev: 0.5 }, 
            explosionLifetime: 1, 
            density: 5, 
            imageSrc: "resources/images/smoke.png"
        })); 
        effects.push(makeEffect({
            center: { x: xPos, y: yPos },
            size: { mean: 20, stdev: 4 }, 
            speed: { mean: 100, stdev: 20 }, 
            lifetime: { mean: 1, stdev: 0.5 }, 
            explosionLifetime: 1, 
            density: 8, 
            imageSrc: "resources/images/fire.png"
        })); 

    }

    function startGame() {
        effects = []; 
    }

    function update(elapsedTime) {
        if (effects[0] && effects[0].isDead()) {
            effects.shift();
        }
        for (let e = 0; e < effects.length; e++) {
            effects[e].update(elapsedTime);
        }
    }

    let api = {
        createShipExplosion: createShipExplosion,
        createAsteroidBreakup: createAsteroidBreakup,
        createUFOExplosion: createUFOExplosion,
        createHyperspaceEffect: createHyperspaceEffect,
        createNewLifeEffect: createNewLifeEffect,
        startGame: startGame,
        update: update,
        get effects() { return effects; },
    }

    return api;
}
