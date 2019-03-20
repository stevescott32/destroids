Game.render.ParticleSystemManager = (function(graphics) {
    'use strict';

    function renderSingleEffect(effect) {
        function render() {
            if (effect.isReady && !effect.isDead()) {
                Object.getOwnPropertyNames(effect.particles).forEach(function (value) {
                    let particle = effect.particles[value];
                    graphics.drawTexture(effect.image, particle.center, particle.rotation, particle.size);
                });
            }
        }

        let api = {
            render: render
        };

        return api;
    }

    function render(particleSystemManager) {
        let effects = particleSystemManager.effects; 
        for(let e = 0; e < effects.length; e++) {
            let effect = effects[e]; 
            //console.log('Effect real render'); 
            renderSingleEffect(effect).render(); 
        }
    }

    function fakeRender(particleSystemManager) {
        let effects = particleSystemManager.fakeEffects; 
        for(let e = 0; e < effects.length; e++) {
            let effect = effects[e]; 
            //console.log('Effect render'); 
            graphics.drawCircle(effect.xPos, effect.yPos, effect.radius); 
        }
    }

    return {
        render: render,
        fakeRender: fakeRender
    };
}(Game.graphics))
