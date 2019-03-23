
/*****************************************
 spec = {
    interval,
    imageSrc,
 */
Game.objects.LaserManager = function (managerSpec) {
  'user strict'; 

  let lasers = [];
  let lastTimeFired = 0;  
  let disableAudio = false; 

  let image = new Image(); 
  let imageReady = false;
  image.onload = function () {
    imageReady = true;
  };
  image.src = managerSpec.imageSrc;

    function toggleAudio() {
      disableAudio = !disableAudio; 
    }

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
      radius: laserSpec.size.height,
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
      if(!disableAudio) {
        let audio = new Audio(managerSpec.audioSrc); 
        audio.play(); 
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
    }
    for (let l = 0; l < lasers.length; l++) {
      let laser = lasers[l];
      laser.center.x -= laser.xSpeed * elapsedTime;
      laser.center.y -= laser.ySpeed * elapsedTime;

      if (laser.center.x < 0 || laser.center.y < 0 ||
        laser.center.x > managerSpec.maxX || laser.center.y > managerSpec.maxY) {
        laser.isDead = true;
        console.log('Laser out of bounds'); 
      }
    }
  }

  let api = {
    addLaser: addLaser,
    startGame: startGame,
    update: update,
    toggleAudio: toggleAudio,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get lasers() { return lasers; }, 
  };

  return api;
}
