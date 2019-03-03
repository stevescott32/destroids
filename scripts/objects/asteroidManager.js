
/*****************************************
 spec = {
    interval,
    imageSrc,
 */
Game.objects.AsteroidManager = function (managerSpec) {
  'user strict';
  console.log('Initializing asteroid manager');

  let asteroids = [];
  let accumulatedTime = 0; 
  let asteroidScore = 0;

  let image = new Image();
  let imageReady = false;
  image.onload = function () {
    imageReady = true;
  };
  image.src = managerSpec.imageSrc;

  function makeAsteroid(asteroidSpec) {
    let asteroid = {
      //center: center,
      center: {
        x: asteroidSpec.center.x,
        y: asteroidSpec.center.y
      },
      size: {
        height: asteroidSpec.size.height,
        width: asteroidSpec.size.width
      },
      radius: asteroidSpec.radius, 
      xSpeed: Math.cos(asteroidSpec.rotation) * asteroidSpec.speed,
      ySpeed: Math.sin(asteroidSpec.rotation) * asteroidSpec.speed,
      rotationSpeed: asteroidSpec.rotationSpeed,
      rotation: asteroidSpec.rotation,
      break: false,
      remove: false
    };

    return asteroid;
  }

  // spec: 
  // x, y, rotation, speed
  function addAsteroid(spec) {
    console.log(spec);
    asteroids.push(makeAsteroid(spec));
  }

  function populateAstroids(elapsedTime) {
    if (accumulatedTime > managerSpec.interval * 1000) {
      accumulatedTime -= managerSpec.interval * 1000;

      let randomSize = Math.random() * 
        (managerSpec.maxSize - managerSpec.minSize) + managerSpec.minSize; 
      let asteroidSpec = {
        center: {
            x: Math.random() * managerSpec.maxX,
            y: Math.random() * managerSpec.maxY,
        },
        size: {
            height: randomSize,
            width: randomSize 
        },
        radius: randomSize / 2,
        rotation: Math.PI, 
        rotationSpeed: Math.random() * Math.PI,
        speed: -1 * managerSpec.minSpeed
    };
    let sign = Math.pow(-1,  Math.floor(Math.random() * 2)); // returns 1 or negative one 
    asteroidSpec.rotationSpeed = sign * 50 * Math.PI * asteroidSpec.speed / (asteroidSpec.size.width * asteroidSpec.size.height); 

      // this switch statement will have asteroids start from 
      // the edges of the game board
      let switcher = Math.floor(Math.random() * 4);
      switch (switcher) {
        case 0:
          asteroidSpec.center.x = 0 - asteroidSpec.radius;
          break;
        case 1:
          asteroidSpec.center.x = managerSpec.maxX + asteroidSpec.radius;
          asteroidSpec.speed *= -1; 
          break;
        case 2:
          asteroidSpec.center.y = 1 - asteroidSpec.radius;
          asteroidSpec.rotation += Math.PI / 2
          break;
        case 3:
          asteroidSpec.center.y = managerSpec.maxY + asteroidSpec.radius;
          asteroidSpec.rotation += Math.PI / 2
          asteroidSpec.speed *= -1; 
          break;
      }

      asteroids.push(makeAsteroid(asteroidSpec));
    }
    else {
      accumulatedTime += elapsedTime;
    }
  }

  function explode(asteroid) {
    asteroidScore += 1;
    asteroid.remove = true;
  }


  function detectLaserCollisions(laserManager) {
    for (let a = 0; a < asteroids.length; a++) {
      let asteroid = asteroids[a];
      if (!asteroid.remove && laserManager.detectCircleCollision(asteroid.center, asteroid.radius)) {
        explode(asteroid);
      }
    }
  }

  // if the square of asteroid radius + input radius is greater than 
  // the distance between the centers, return true
  function detectCircleCollision(center, radius) {
    for (let a = 0; a < asteroids.length; a++) {
      let asteroid = asteroids[a];
      let distanceSquared = Math.pow(center.x - asteroid.center.x, 2) + Math.pow(center.y - asteroid.center.y, 2);
      let radiusSum = asteroid.radius + radius;
      if (!asteroid.remove && radiusSum * radiusSum > distanceSquared) {
        return true;
      }
    }
    return false;
  }

  /// move asteroids according to speed and the elapsed time 
  function update(elapsedTime) {
    if (asteroids[0] && asteroids[0].remove) {
      asteroids.shift();
    }
    populateAstroids(elapsedTime); 
    for (let a = 0; a < asteroids.length; a++) {
      let asteroid = asteroids[a];
      asteroid.center.x += asteroid.xSpeed * elapsedTime / 1000;
      asteroid.center.y += asteroid.ySpeed * elapsedTime / 1000;
      asteroid.rotation += asteroid.rotationSpeed * elapsedTime / 1000;

      if (asteroid.center.x + asteroid.radius < 0 || asteroid.center.y + asteroid.radius < 0 ||
        asteroid.center.x - asteroid.radius > managerSpec.maxX || asteroid.center.y - asteroid.radius > managerSpec.maxY) {
        asteroid.remove = true;
      }
    }
  }

  function startGame() {
    asteroids = [];
    asteroidScore = 0; 
    accumulatedTime = 0; 
  }

  let api = {
    addAsteroid: addAsteroid,
    detectLaserCollisions: detectLaserCollisions,
    detectCircleCollision, detectCircleCollision,
    update: update,
    startGame: startGame,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get asteroids() { return asteroids; },
    get asteroidScore() { return asteroidScore; }
  };

  return api;
}
