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
Game.render.Laser = (function(graphics) {
  'use strict';

  function render(laserManager) {
    let lasers = laserManager.lasers; 
    for(let l = 0; l < lasers.length; l++) {
      //console.log('Rendering laser ' + l); 
      let laser = lasers[l]; 
       if (laserManager.imageReady) {
         if(laser.isDead) {
           //console.log('Dead laser'); 
           continue; 
         }
         //console.log('Rendering a laser!');
         //console.log(laser); 
          graphics.drawTexture(
            laserManager.image, laser.center, laser.rotation, laser.size);
      }
      else { console.log('Laser image not ready'); }
   }
  }

  return {
      render: render
  };
}(Game.graphics));
