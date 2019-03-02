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

  function render(asteroidManager) {
    let asteroids = asteroidManager.asteroids; 
    for(let a = 0; a < asteroids.length; a++) {
      //console.log('Trying to render an asteroid'); 
      let asteroid = asteroids[a]; 
       if (asteroidManager.imageReady) {
         if(asteroid.remove) {
           continue; 
         }
        //console.log('Rendering an asteroid at ' + asteroid.center.x
        //+ ': ' + asteroid.center.y ); 
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
