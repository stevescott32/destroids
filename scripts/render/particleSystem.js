/*Game.render.ParticleSystem = (function (system, graphics, imageSrc) {
    console.log('Particle System renderer is booting up'); 
    let image = new Image();
    let isReady = false;

    image.onload = () => {
        isReady = true;
    };
    image.src = imageSrc;

    function renderEffect() {
        if (isReady) {
            Object.getOwnPropertyNames(system.particles).forEach(function (value) {
                let particle = system.particles[value];
                graphics.drawTexture(image, particle.center, particle.rotation, particle.size);
            });
        }
    }

    let api = {
        render: render
    };

    return api;
});
*/

// --------------------------------------------------------------
//
// Renders a Laser object.
//
// spec = {
//    image: ,
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
/*
Game.render.ParticleSystemManager = (function (graphics) {
    'use strict';

    console.log('Particle System renderer is booting up');
    function renderOneEffect(effect) {
        let image = new Image();
        let isReady = false;

        image.onload = () => {
            isReady = true;
        };
        image.src = effect.imageSrc;

        function render() {
            if (isReady) {
                Object.getOwnPropertyNames(effect.particles).forEach(function (value) {
                    let particle = effect.particles[value];
                    graphics.drawTexture(image, particle.center, particle.rotation, particle.size);
                });
            }
        }

        let api = {
            render: render
        };

        return api;
    }

    function render(effects) {
        //let effects = particleSystemManager.effects; 
        //console.log(effects); 
        for(let e = 0; e < effects.length; e++) {
            renderOneEffect(effects[e]).render(); 
        }

    }

    let api = {
        render: render
    };

    return api; 


    /*console.log('Starting asteroid rendering 2'); 
  
    function render(asteroidManager) {
      let asteroids = asteroidManager.asteroids; 
      for(let a = 0; a < asteroids.length; a++) {
        let asteroid = asteroids[a]; 
         if (asteroidManager.imageReady) {
           if(asteroid.remove) {
             continue; 
           }
            graphics.drawTexture(
              asteroidManager.image, asteroid.center, asteroid.rotation, asteroid.size);
        }
        else { console.log('Asteroid image not ready'); }
     }
    }
  
    return {
        render: render
    };
    */
//}(Game.graphics));

Game.render.ParticleSystemManager = (function(graphics) {
    'use strict';

    function render(particleSystemManager) {
        let effects = particleSystemManager.effects; 
        for(let e = 0; e < effects.length; e++) {
            let effect = effects[e]; 
            console.log('Effect render'); 
            graphics.drawCircle(effect.xPos, effect.yPos, effect.radius); 
        }
    }

    return {
        render: render
    };
}(Game.graphics))
