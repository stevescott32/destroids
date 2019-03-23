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
Game.render.SpaceShip = (function (graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady && !spec.crashed && !spec.isDead) {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        }

        if (spec.getHyperspacePercentage) {
            let hyperspaceBar = document.getElementById("myBar");
            let width = spec.getHyperspacePercentage() * 100;  
            if(width >= 100) { 
                width = 100; 
                hyperspaceBar.style.background = "green";
            } else if(width < 100) {
                hyperspaceBar.style.background = "grey";
            }
            hyperspaceBar.style.width = width + '%';
        }
    }

    return {
        render: render
    };
}(Game.graphics));
