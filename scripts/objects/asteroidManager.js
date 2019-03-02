
/*****************************************
 spec = {
    interval,
    imageSrc,
 */
Game.objects.AsteroidManager = function (managerSpec) {
  'user strict';
  console.log('Initializing asteroid manager');

  let asteroids = [];
  let lastTimeCreated = 0;
  let accumulatedTime = 0; 
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
      radius: (asteroidSpec.size.height + asteroidSpec.size.width) / 4.1,
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
      /*let asteroid = {
        center: { x: Math.random() * managerSpec.maxX, y: Math.random() * managerSpec.maxY },
        size: { height: 150, width: 150 },
        radius: 75,
        rotation: Math.PI / 8,
        rotationSpeed: Math.PI / 8, // radians per second
        speed: 100, // pixels per second
      };*/
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
        rotation: 2.5 * Math.PI / 2,
        rotationSpeed: Math.PI / 16,
        //speed: -1 * Math.random() * 
        //  (managerSpec.maxSpeed - managerSpec.minSpeed) + managerSpec.minSpeed, 
        speed: -1 * managerSpec.minSpeed
    };

      // this switch statement will have asteroids start from 
      // the edges of the game board
      let switcher = Math.floor(Math.random() * 4);
      switch (switcher) {
        case 0:
          asteroidSpec.center.x = 1;
          break;
        case 1:
          asteroidSpec.center.x = managerSpec.maxX - 1;
          asteroidSpec.speed *= -1; 
          break;
        case 2:
          asteroidSpec.center.y = 1;
          break;
        case 3:
          asteroidSpec.center.y = managerSpec.maxY - 1;
          asteroidSpec.speed *= -1; 
          break;
      }

      asteroids.push(makeAsteroid(asteroidSpec));
      console.log(asteroids[asteroids.length - 1]); 
    }
    else {
      accumulatedTime += elapsedTime;
    }
  }

  function explode(asteroid) {
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

      if (asteroid.center.x < 0 || asteroid.center.y < 0 ||
        asteroid.center.x > managerSpec.maxX || asteroid.center.y > managerSpec.maxY) {
        asteroid.remove = true;
        console.log('Setting asteroid to remove');
      }
    }
  }

  let api = {
    addAsteroid: addAsteroid,
    detectLaserCollisions: detectLaserCollisions,
    detectCircleCollision, detectCircleCollision,
    update: update,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get asteroids() { return asteroids; },
  };

  return api;
}
