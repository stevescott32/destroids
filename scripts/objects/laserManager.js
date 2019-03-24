
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

  // reset the lasers and timer so a new game can begin
  function startGame() {
    lasers = []; 
    lastTimeFired = 0; 
  }

  function update(elapsedTime) {
    // remove dead lasers
    if(lasers[0] && lasers[0].isDead) {
      lasers.shift(); 
    }
    // update laser positions
    for (let l = 0; l < lasers.length; l++) {
      let laser = lasers[l];
      laser.center.x -= laser.xSpeed * elapsedTime;
      laser.center.y -= laser.ySpeed * elapsedTime;

      // check if laser has left the bounds of the canvas and should be dead 
      if (laser.center.x < 0 || laser.center.y < 0 ||
        laser.center.x > Game.graphics.canvas.width || laser.center.y > Game.graphics.canvas.height) {
        laser.isDead = true;
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
