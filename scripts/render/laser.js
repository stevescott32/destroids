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
Game.render.Laser = (function (graphics) {
  'use strict';

  function render(laserManager) {
    let lasers = laserManager.lasers;
    for (let l = 0; l < lasers.length; l++) {
      let laser = lasers[l];
      if (laserManager.imageReady) {
        if (laser.isDead) {
          continue;
        }
        graphics.drawTexture(
          laserManager.image, laser.center, laser.rotation, laser.size);
      }
    }
  }

  return {
    render: render
  };
}(Game.graphics));
