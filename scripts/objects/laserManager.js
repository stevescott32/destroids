
/*****************************************
 spec = {
    interval,
    imageSrc,
 */
Game.objects.LaserManager = function (managerSpec) {
  'user strict'; 
  console.log('Initializing laser manager'); 

  let lasers = [];
  let lastTimeFired = 0;  
  let image = new Image(); 
  let imageReady = false;
  image.onload = function () {
    imageReady = true;
  };
  image.src = managerSpec.imageSrc;

  function makeLaser(laserSpec) {
    let center = {
      x: laserSpec.center.x,
      y: laserSpec.center.y
    }
    let laser = {
      center: center,
      xSpeed: Math.cos(laserSpec.rotation) * laserSpec.speed,
      ySpeed: Math.sin(laserSpec.rotation) * laserSpec.speed,
      size: laserSpec.size,
      rotation: laserSpec.rotation,
      isDead: false
    };

    return laser;
  }

  // spec: 
  // x, y, rotation, speed
  function addLaser(spec) {
    if(performance.now() - lastTimeFired > managerSpec.interval) {
      lastTimeFired = performance.now(); 
      lasers.push(makeLaser(spec));
      // TODO: make noise
    }
  }


  // check if the circle object has collided with any of the lasers in the laser manager 
  function detectCircleCollision(center, radius) {
    for(let l = 0; l < lasers.length; l++) {
      let laser = lasers[l]; 
      let distanceSquared = Math.pow(center.x - laser.center.x, 2) + Math.pow(center.y - laser.center.y, 2); 
      if(!laser.isDead && radius * radius > distanceSquared) {
        laser.isDead = true; 
        return true; 
      }
    }
  }

  function startGame() {
    lasers = []; 
    lastTimeFired = 0; 
  }

  function update(elapsedTime) {
    if(lasers[0] && lasers[0].isDead) {
      lasers.shift(); 
      console.log('Removing a laser'); 
    }
    for (let l = 0; l < lasers.length; l++) {
      let laser = lasers[l];
      laser.center.x -= laser.xSpeed * elapsedTime;
      laser.center.y -= laser.ySpeed * elapsedTime;

      if (laser.center.x < 0 || laser.center.y < 0 ||
        laser.center.x > managerSpec.maxX || laser.center.y > managerSpec.maxY) {
        laser.isDead = true;
      }
    }
  }

  let api = {
    addLaser: addLaser,
    detectCircleCollision: detectCircleCollision,
    startGame: startGame,
    update: update,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get lasers() { return lasers; }, 
  };

  return api;
}
