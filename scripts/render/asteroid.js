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
Game.render.Asteroid = (function(graphics) {
  'use strict';
  console.log('Starting asteroid rendering'); 

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
}(Game.graphics));
