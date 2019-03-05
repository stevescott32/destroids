Game.objects.ParticleSystemManager = function (managerSpec) {
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
