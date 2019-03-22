Game.render.AlienShipManager = (function(graphics) {
    'use strict';

    function renderOneShip(spec) {
        if (spec.imageReady && !spec.crashed) {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        }
    }

    function render(alienShipManager) {
        for(let s = 0; s < alienShipManager.ships.length; s++) {
            renderOneShip(alienShipManager.ships[s]); 
        }
    }

    return {
        render: render
    };
}(Game.graphics));
