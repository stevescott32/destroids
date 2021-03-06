/*****************************************
 spec = {
    interval,
    imageSrc,
 */
Game.objects.AsteroidManager = function (managerSpec) {
  'user strict';

  let asteroids = [];
  let accumulatedTime = 0;
  let asteroidScore = 0;
  let disableAudio = false; 

  let image = new Image();
  let imageReady = false;
  image.onload = function () {
    imageReady = true;
  };
  image.src = managerSpec.imageSrc;

  function asteroidMaker(asteroidSpec) {
    // speed follows gaussian distribution divided by the size 
    let speed = -1 * Random.nextGaussian(
      ((managerSpec.maxSpeed - managerSpec.minSpeed) / 2) + managerSpec.minSpeed,
      (managerSpec.maxSpeed - managerSpec.minSpeed) / 4)
      / (asteroidSpec.sizeCategory);

    // larger asteroids rotate more slowely 
    let sign = Math.pow(-1, Math.floor(Math.random() * 2)); // returns 1 or negative one 
    let rotationSpeed = sign * Math.PI * speed / (asteroidSpec.sizeCategory * managerSpec.minSize);

    let rotation = Math.random() * Math.PI * 2;

    let asteroid = {
      center: {
        x: asteroidSpec.center.x,
        y: asteroidSpec.center.y
      },
      size: {
        height: managerSpec.minSize * asteroidSpec.sizeCategory,
        width: managerSpec.minSize * asteroidSpec.sizeCategory,
        sizeCategory: asteroidSpec.sizeCategory
      },
      radius: managerSpec.minSize * asteroidSpec.sizeCategory / 2,
      xSpeed: Math.cos(rotation) * speed,
      ySpeed: Math.sin(rotation) * speed,
      rotation: rotation,
      rotationSpeed: rotationSpeed,
      break: false,
      isDead: false
    };

    return asteroid;
  }

  function generateBrokenAsteroid(x, y, sizeCategory) {
    return asteroidMaker({
      center: { x: x, y: y },
      sizeCategory: sizeCategory,
    });
  }

  function generateNewAsteroid() {
    let sizeCategory = Math.ceil(Math.random() * 3);
    let center = {
      x: Random.nextGaussian(managerSpec.maxX / 2, managerSpec.maxX / 4),
      y: Random.nextGaussian(managerSpec.maxY / 2, managerSpec.maxY / 4),
    }

    // this switch statement will have asteroids start from 
    // the edges of the game board
    let switcher = Math.floor(Math.random() * 4);
    switch (switcher) {
      case 0:
        center.x = 0 - sizeCategory * managerSpec.minSize / 2;
        break;
      case 1:
        center.x = managerSpec.maxX + sizeCategory * managerSpec.minSize / 2;
        break;
      case 2:
        center.y = 1 - sizeCategory * managerSpec.minSize / 2;
        break;
      case 3:
        center.y = managerSpec.maxY + sizeCategory * managerSpec.minSize / 2;
        break;
    }
    return asteroidMaker({
      center: center,
      sizeCategory: sizeCategory
    });
  }

  function populateAstroids(elapsedTime) {
    // if the script has been paused by the browser or something, 
    // we don't want to create a wall of astroids from all directions 
    if (accumulatedTime > 2 * managerSpec.interval * 1000) {
      accumulatedTime = 2 * managerSpec.interval * 1000;
    }
    // if we didn't generate an asteroid recently, make one 
    if (accumulatedTime > managerSpec.interval * 1000) {
      accumulatedTime -= managerSpec.interval * 1000;

      if(asteroids.length < managerSpec.maxAsteroids) {
        asteroids.push(generateNewAsteroid());
      }
    }
    else {
      accumulatedTime += elapsedTime;
    }
  }

  function toggleAudio() {
    disableAudio = !disableAudio; 
  }

  function explode(asteroid, particleSystemManager) {
    asteroidScore += 1;
    asteroid.isDead = true;
    particleSystemManager.createAsteroidBreakup(asteroid)
    if (asteroid.size.sizeCategory > 1) {
      let numToGenerate = 3 + (3 % asteroid.size.sizeCategory);
      for (let a = 0; a < numToGenerate; a++) {
        asteroids.push(generateBrokenAsteroid(asteroid.center.x, asteroid.center.y, asteroid.size.sizeCategory - 1));
      }
    }
    console.log('Asteroids size ' + asteroids.length); 
    if(!disableAudio) {
      let audio = new Audio(managerSpec.audioSrc);
      audio.volume = 0.3;
      audio.play(); 
    }
  }


  /// move asteroids according to speed and the elapsed time 
  function update(elapsedTime) {
    // remove dead asteroids
    asteroids = asteroids.filter( asteroid => !asteroid.isDead); 

    populateAstroids(elapsedTime);
    for (let a = 0; a < asteroids.length; a++) {
      let asteroid = asteroids[a];
      asteroid.center.x += asteroid.xSpeed * elapsedTime / 1000;
      asteroid.center.y += asteroid.ySpeed * elapsedTime / 1000;
      asteroid.rotation += asteroid.rotationSpeed * elapsedTime / 1000;

      if(asteroid.center.x + asteroid.radius < 0) 
      {
          asteroid.center.x = managerSpec.maxX + asteroid.radius; 
      }
      else if(asteroid.center.x - asteroid.radius > managerSpec.maxX) {
          asteroid.center.x = 0 - asteroid.radius; 
      }
      else if(asteroid.center.y + asteroid.radius < 0) 
      {
          asteroid.center.y = managerSpec.maxY + asteroid.radius; 
      }
      else if(asteroid.center.y - asteroid.radius > managerSpec.maxY) {
          asteroid.center.y = 0 - asteroid.radius; 
      }
    }
  }

  function startGame() {
    asteroids = [];
    asteroidScore = 0;
    accumulatedTime = 0;
    for(let initialAsteroids = 0; initialAsteroids < managerSpec.initialAsteroids; initialAsteroids++) {
      asteroids.push(generateNewAsteroid()); 
    }
  }

  let api = {
    update: update,
    startGame: startGame,
    explode, explode,
    toggleAudio, toggleAudio, 
    get imageReady() { return imageReady; },
    get image() { return image; },
    get asteroids() { return asteroids; },
    get asteroidScore() { return asteroidScore; }
  };

  return api;
}
