// --------------------------------------------------------------
//
// Renders a Logo object.
//
// spec = {
//    image: ,
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
Game.render.SpaceShip = (function(graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady && !spec.crashed) {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        }
    }

    return {
        render: render
    };
}(Game.graphics));
