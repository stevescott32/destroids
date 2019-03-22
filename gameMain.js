Game.screens['game-play'] = (function (game, objects, renderer, graphics, input, highScoreManager) {
    let inputBuffer = {};

    // time
    let lastTimeStamp = performance.now();
    let elapsedTime = 0; 
    let quit = false;

    // current state
    let score = 0;
    let cancelNextRequest = true; 

    // ********************************************
    // ********* Objects for the game *************
    // ********************************************

    let gameKeyboard = input.Keyboard();

    // player spaceship. starts in the middle of the screen
    let spaceShip = objects.SpaceShip({
        imageSrc: 'resources/images/ships/ship3.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
        size: { width: 80, height: 80 },
        radius: 35,
        canvasHeight: graphics.canvas.height,
        canvasWidth: graphics.canvas.width,
        thrust: 500 / 1000,
        rotationRate: Math.PI / 16, // radians per second
        crashed: false,
        hyperspaceInterval: 5 // seconds
    });

    // manager for all lasers fired by player spaceship
    let spaceShipLasers = objects.LaserManager({
        imageSrc: 'resources/images/lasers/laser.png',
        maxX: graphics.canvas.height,
        maxY: graphics.canvas.width,
        interval: 200 // milliseconds
    });

    let alienLasers = objects.LaserManager({
        imageSrc: 'resources/images/lasers/purpleBlob.png',
        maxX: graphics.canvas.height,
        maxY: graphics.canvas.width,
        interval: 500 // milliseconds
   }); 

   let alienShipManager = objects.AlienShipManager({
        canvasHeight: graphics.canvas.height,
        canvasWidth: graphics.canvas.width,
        lasers: alienLasers
    });

    // manager for all asteroids in the game
    let asteroidManager = objects.AsteroidManager({
        imageSrc: "resources/images/asteroid.png",
        maxX: graphics.canvas.height,
        maxY: graphics.canvas.width,
        maxSize: 200,
        minSize: 65, 
        maxSpeed: 100,
        minSpeed: 50,
        interval: 1, // seconds
        maxAsteroids: 20,
        initialAsteroids: 10
    }, objects);

    let lifeManager = objects.LifeManager({
        lives: 3
    }); 

    let particleSystemManager = objects.ParticleSystemManager({}); 

    // ********************************************
    // *********** Keyboard actions ***************
    // ********************************************

    function playerShoot() {
        if(!quit) {
            spaceShipLasers.addLaser(spaceShip.shoot()); 
        }
    }

    function hyperspace() {
        if(spaceShip.playerHyperspace(asteroidManager.asteroids)) {
            particleSystemManager.createHyperspaceEffect(spaceShip); 
        }
    }

    function escape() {
        cancelNextRequest = true; 
        game.showScreen('main-menu'); 
    }

    // ********************************************
    // ********** Changing Game State *************
    // ********************************************

    // start a new game, resetting all objects
    function startGame() {
        quit = false;
        cancelNextRequest = false; 
        score = 0;
        inputBuffer = {};
        lifeManager.startGame(); 
        spaceShip.startGame();
        asteroidManager.startGame(); 
        highScoreManager.startGame(); 
        particleSystemManager.startGame(); 
        spaceShipLasers.startGame(); 
        alienShipManager.startGame(); 
        spaceShip.crashed = false; 
        startTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    // stop gameplay, updating state 
    function endGame() {
        quit = true;
        cancelNextRequest = true; 
        score = asteroidManager.asteroidScore;  
        highScoreManager.endGame(score); 
        game.showScreen('main-menu'); 
    }

    // set up the game the first time it is loaded
    function initialize() {
        window.addEventListener('keydown', function (event) {
            inputBuffer[event.key] = event.key;
        });

        gameKeyboard.register('ArrowUp', spaceShip.thrust);
        gameKeyboard.register('ArrowLeft', spaceShip.rotateLeft);
        gameKeyboard.register('ArrowRight', spaceShip.rotateRight);
        gameKeyboard.register(' ', playerShoot);
        gameKeyboard.register('z', hyperspace); 
        gameKeyboard.register('Escape', escape); 
    }

    function run() {
        //graphics.canvas.width = window.innerWidth; 
        //graphics.canvas.height = window.innerHeight; 
        lastTimeStamp = performance.now(); 
        cancelNextRequest = false; 
        startGame(); 
    }

    function playerHit() {
        particleSystemManager.createShipExplosion(spaceShip.center.x, spaceShip.center.y); 
        spaceShip.crashed = true;
        lifeManager.loseLife(); 
        if(lifeManager.isGameOver()) {
            endGame(); 
        }
        else {
            spaceShip.crashed = false; 
            spaceShip.startGame(); 
            spaceShip.newLifeHyperspace(asteroidManager.asteroids); 
            particleSystemManager.createNewLifeEffect(spaceShip); 
        }
    }

    // detect all collisions that are occuring in the game
    function detectCollisions() {
        // player lasers with alien ships
        alienShipManager.ships.forEach(ship => {
            if(Collisions.detectCircleCollision(ship, spaceShip)) {
                playerHit();
                ship.crash();
                particleSystemManager.createUFOExplosion(ship.center.x, ship.center.y); 
            }
            spaceShipLasers.lasers.forEach(laser => {
                if(Collisions.detectCircleCollision(ship, laser)) {
                    ship.crash(); 
                    laser.isDead = true; 
                    particleSystemManager.createUFOExplosion(ship.center.x, ship.center.y); 
                } 
            })
        });

        // alien lasers with player ship
        alienLasers.lasers.forEach(laser => {
            if(Collisions.detectCircleCollision(spaceShip, laser)) {
                laser.isDead = true; 
                playerHit(); 
            }
        })
    }

    // ********************************************
    // ***************** Update *******************
    // ********************************************

    // update function manages end time update
    function update(elapsedTime) {
        gameKeyboard.update(elapsedTime);
        asteroidManager.update(elapsedTime);
        spaceShipLasers.update(elapsedTime);
        alienLasers.update(elapsedTime);
        alienShipManager.update(elapsedTime); 
        if(!quit) {
            spaceShip.update(elapsedTime);
            asteroidManager.detectLaserCollisions(spaceShipLasers, particleSystemManager);
        }
        particleSystemManager.update(elapsedTime); 
        score = asteroidManager.asteroidScore; 
        highScoreManager.update(elapsedTime, score); 

        detectCollisions(); 

        if (!spaceShip.crashed && asteroidManager.detectCircleCollision(spaceShip.center, spaceShip.radius)) {
            playerHit(); 
        }
    }

    // *****************************************
    // ************* Render ********************
    // *****************************************
    function render() {
        graphics.context.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
        renderer.Laser.render(spaceShipLasers);
        renderer.Asteroid.render(asteroidManager);
        renderer.AlienShipManager.render(alienShipManager); 
        if(!quit) {
            renderer.SpaceShip.render(spaceShip); 
        }
        renderer.ParticleSystemManager.render(particleSystemManager);
        highScoreManager.render(); 
        renderer.Laser.render(alienLasers);
    }


    function gameLoop() {
        elapsedTime = performance.now() - lastTimeStamp;
        lastTimeStamp = performance.now(); 
        update(elapsedTime);
        render();

        if(!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    // ********************************************
    // *************** Buttons ********************
    // ********************************************

    // restart the game, resetting all needed values
    function restartGame() {
        endGame();
        startGame(); 
    }

    function clearHighScores() {
        highScoreManager.clearHighScores();
    }

    return {
        clearHighScores: clearHighScores,
        restartGame: restartGame,
        run: run,
        initialize: initialize
    };

}(Game.game, Game.objects, Game.render, Game.graphics, Game.input, Game.highScores)); 
