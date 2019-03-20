/*Game.objects.ParticleSystemManager = function (managerSpec) {
    let effects = []; 

    function makeParticleEffect(spec) {
        let nextName = 1;
        let particles = {};

        function maker(spec) {
            let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
            let particleSystem = {
                center: { x: spec.center.x, y: spec.center.y },
                size: { x: size, y: size },
                direction: Random.nextCircleVector(),
                speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
                rotation: 0,
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), // seconds
                alive: 0,
                imageSrc: spec.imageSrc
            };

            return particleSystem;
        }

        maker(spec); 

        function update(elapsedTime) {
            let removeMe = [];

            elapsedTime = elapsedTime / 1000;

            for (let particle = 0; particle < 2; particle++) {
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
            get particles() { return particles; },
        };

        return api;
    }

    function createShipExplosion(xPos, yPos) {
        console.log('Creating ship explosion at ' + xPos + ': ' + yPos); 
        effects.push(makeParticleEffect({
            center: { x: xPos, y: yPos },
            size: { mean: 12, stdev: 3 },
            speed: { mean: 65, stdev: 35 },
            lifetime: { mean: 4, stdev: 1},
            imageSrc: "resources/textures/fire.png" 
        }));
    }

    function createAsteroidBreakup() {
    console.log('Creating asteroid explosion at ' + xPos + ': ' + yPos); 
        effects.push(makeParticleEffect({
            center: { x: xPos, y: yPos },
            size: { mean: 12, stdev: 3 },
            speed: { mean: 65, stdev: 35 },
            lifetime: { mean: 4, stdev: 1},
            imageSrc: "resources/textures/smoke.png" 
        }));

    }

    function createUFOExplosion() {
    console.log('Creating UFO explosion at ' + xPos + ': ' + yPos); 
        effects.push(makeParticleEffect({
            center: { x: xPos, y: yPos },
            size: { mean: 12, stdev: 3 },
            speed: { mean: 65, stdev: 35 },
            lifetime: { mean: 4, stdev: 1},
            imageSrc: "resources/textures/fire.png" 
        }));

    }

    function update(elapsedTime) {
        for(let e = 0; e < effects.length; e++) {
            effects[e].update(elapsedTime); 
        }
    }
    let api = {
        createShipExplosion: createShipExplosion,
        createAsteroidBreakup: createAsteroidBreakup,
        createUFOExplosion: createUFOExplosion,
        update: update,
        get effects() { return effects; } 
    }

    return api; 
};

*/

Game.objects.ParticleSystemManager = function (managerSpec) {
    let effects = [];
    let realEffects = []; 

    function makeRealEffect(spec) {
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

            for (let particle = 0; particle < 10; particle++) {
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

    function makeEffect(effectSpec) {
        console.log('Making effect');
        let radius = effectSpec.radius;
        let rate = effectSpec.rate;
        let lifeTime = effectSpec.lifeTime * 1000;
        let timeAlive = 0; // miliseconds 
        let xPos = effectSpec.xPos;
        let yPos = effectSpec.yPos;


        function update(elapsedTime) {
            radius += rate * elapsedTime / 1000;
            //console.log(radius);
            timeAlive += elapsedTime;
        }

        function isDead() {
            if (timeAlive > lifeTime) {
                console.log('Effect is dead!');
                return true;
            } else {
                return false;
            }
        }

        let api = {
            get radius() { return radius; },
            get xPos() { return xPos; },
            get yPos() { return yPos; },
            isDead: isDead,
            update: update
        }

        return api;
    }

    function createAsteroidBreakup(xPos, yPos) {
        effects.push(makeEffect({
            radius: 10,
            rate: 1 / 15,
            lifeTime: 5,
            xPos: xPos,
            yPos: yPos
        }));

    }

    function createShipExplosion(xPos, yPos) {
        effects.push(makeEffect({
            radius: 10,
            rate: 10,
            lifeTime: 5,
            xPos: xPos,
            yPos: yPos
        }));

        realEffects.push(makeRealEffect({
            center: { x: xPos, y: yPos },
            size: { mean: 20, stdev: 4 }, 
            speed: { mean: 100, stdev: 20 }, 
            lifetime: { mean: 1, stdev: 0.5 }, 
            explosionLifetime: 1, 
            imageSrc: "resources/images/fire.png"
        })); 
    }

    function createUFOExplosion(xPos, yPos) {
        effects.push(makeEffect({
            radius: 10,
            rate: 1 / 25,
            lifeTime: 5,
            xPos: xPos,
            yPos: yPos
        }));

    }

    function update(elapsedTime) {
        if (effects[0] && effects[0].isDead()) {
            effects.shift();
            console.log('Removing effect');
        }
        if (realEffects[0] && realEffects[0].isDead()) {
            realEffects.shift();
            console.log('Removing real effect');
        }
        for (let e = 0; e < effects.length; e++) {
            effects[e].update(elapsedTime);
        }
        for (let e = 0; e < realEffects.length; e++) {
            realEffects[e].update(elapsedTime);
        }
    }

    let api = {
        createShipExplosion: createShipExplosion,
        createAsteroidBreakup: createAsteroidBreakup,
        createUFOExplosion: createUFOExplosion,
        update: update,
        get effects() { return effects; },
        get realEffects() { return realEffects; }
    }

    return api;
}
