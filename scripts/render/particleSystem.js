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
            renderSingleEffect(effect).render(); 
        }
    }

    return {
        render: render
    };
}(Game.graphics))
