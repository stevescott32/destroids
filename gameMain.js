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
        audioSrc: 'resources/audio/death_flash.flac', 
        newLifeAudio: 'resources/audio/powerUp.mp3', 
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
        size: { width: 80, height: 80 },
        radius: 35,
        thrust: 500 / 1000,
        rotationRate: Math.PI / 12, // radians per second
        crashed: false,
        hyperspaceInterval: 5 // seconds
    });

    // manager for all lasers fired by player spaceship
    let spaceShipLasers = objects.LaserManager({
        imageSrc: 'resources/images/lasers/redLaser.png',
        audioSrc: 'resources/audio/laser3.mp3', 
        interval: 200 // milliseconds
    });

    let alienLasers = objects.LaserManager({
        imageSrc: 'resources/images/lasers/purpleBlob.png',
        audioSrc: 'resources/audio/laser9.mp3', 
        interval: 500 // milliseconds
   }); 

   let alienShipManager = objects.AlienShipManager({
        lasers: alienLasers
    });

    // manager for all asteroids in the game
    let asteroidManager = objects.AsteroidManager({
        imageSrc: "resources/images/asteroid.png",
        audioSrc: 'resources/audio/coin10.wav',
        maxSize: 200,
        minSize: 65, 
        maxSpeed: 100,
        minSpeed: 50,
        interval: 1, // seconds
        maxAsteroids: 12,
        initialAsteroids: 8,
    }, objects);

    let lifeManager = objects.LifeManager({
        lives: 3
    }); 

    let particleSystemManager = objects.ParticleSystemManager({}); 

    // ********************************************
    // *********** Keyboard actions ***************
    // ********************************************

    let lastAudioOff = 0; 
    // the player laser and the asteroid sound do not help the 
    // player to win, so they can be toggled off 
    function toggleUnhelpfulAudio() {
        // don't toggle repeatedly if the toggle is held down
        if(performance.now() - lastAudioOff > 1000) {
            lastAudioOff = performance.now(); 
            spaceShipLasers.toggleAudio();
            asteroidManager.toggleAudio();
        } 
    }

    function playerShoot() {
        if(!quit) {
            spaceShipLasers.addLaser(spaceShip.shoot()); 
        }
    }

    function hyperspace() {
        let allObjects = []; 
        allObjects.push(asteroidManager.asteroids); 
        //console.log(asteroidManager.asteroids); 
        allObjects.push(alienLasers.lasers); 
        //console.log(alienLasers.lasers); 
        allObjects.push(alienShipManager.ships); 
        //console.log(alienShipManager.ships); 
        try {
            if(spaceShip.playerHyperspace(allObjects)) {
                particleSystemManager.createHyperspaceEffect(spaceShip); 
            }
        } catch (error) {
            console.log('Hyperspace smash'); 
            asteroidManager.startGame();
            alienLasers.startGame();
            alienShipManager.startGame();  
            particleSystemManager.clearScreen(); 
            spaceShip.center.x = graphics.canvas.width / 2;
            spaceShip.center.y = graphics.canvas.height / 2; 
        }
    }

    function thrust() {
        spaceShip.thrust(); 
        particleSystemManager.createThrustEffect(spaceShip); 
    }

    function escape() {
        if(confirm("Are you sure you want to leave this game?")) {
            cancelNextRequest = true; 
            game.showScreen('main-menu'); 
        }
        else {
            lastTimeStamp = performance.now(); 
        }
        gameKeyboard.reset(); 
        initialize(); 
    }

    function resiseCanvas() {
        graphics.canvas.height = window.innerHeight;
        graphics.canvas.width = window.innerWidth; 
    }

    // ********************************************
    // ********** Changing Game State *************
    // ********************************************

    // start a new game, resetting all objects
    function startGame() {
        resiseCanvas(); 
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
        highScoreManager.endGame(score); 
        game.showScreen('high-scores'); 
    }

    // set up the game the first time it is loaded
    function initialize() {
        window.addEventListener('keydown', function (event) {
            inputBuffer[event.key] = event.key;
        });
        window.addEventListener('onresize', () => { resiseCanvas() }); 
        window.addEventListener('resize', () => { resiseCanvas() }); 

        gameKeyboard.register('ArrowUp', thrust);
        gameKeyboard.register('ArrowLeft', spaceShip.rotateLeft);
        gameKeyboard.register('ArrowRight', spaceShip.rotateRight);
        gameKeyboard.register(' ', playerShoot);
        gameKeyboard.register('z', hyperspace); 
        gameKeyboard.register('Escape', escape); 
        gameKeyboard.register('t', toggleUnhelpfulAudio); 
    }

    function run() {
        lastTimeStamp = performance.now(); 
        cancelNextRequest = false; 
        startGame(); 
    }

    function playerHit() {
        particleSystemManager.createShipExplosion(spaceShip.center.x, spaceShip.center.y); 
        spaceShip.crashed = true;
        spaceShip.crash(); 
        lifeManager.loseLife(); 
        if(lifeManager.isGameOver()) {
            endGame(); 
        }
        else {
            spaceShip.crashed = false; 
            spaceShip.startGame(); 

            let allObjects = []; 
            allObjects.push(asteroidManager.asteroids); 
            allObjects.push(alienLasers.lasers); 
            allObjects.push(alienShipManager.ships); 
            try {
                spaceShip.newLifeHyperspace(allObjects); 
                particleSystemManager.createNewLifeEffect(spaceShip);
            } catch (error) {
                console.log('Hyperspace smash'); 
                asteroidManager.startGame();
                alienLasers.startGame();
                alienShipManager.startGame();  
                particleSystemManager.clearScreen(); 
                spaceShip.center.x = graphics.canvas.width / 2;
                spaceShip.center.y = graphics.canvas.height / 2; 
            }

        }
    }

    // ********************************************
    // ************* Collisions *******************
    // ********************************************

    // detect all collisions that are occuring in the game
    function detectCollisions() {
        // alien ships with player and player lasers 
        alienShipManager.ships.forEach(ship => {
            if(!ship.isDead && Collisions.detectCircleCollision(ship, spaceShip)) {
                playerHit();
                ship.crash();
                particleSystemManager.createUFOExplosion(ship.center.x, ship.center.y); 
            }
            spaceShipLasers.lasers.forEach(laser => {
                if(!laser.isDead && Collisions.detectCircleCollision(ship, laser)) {
                    ship.crash(); 
                    laser.isDead = true; 
                    particleSystemManager.createUFOExplosion(ship.center.x, ship.center.y); 
                    score += 100; 
                } 
            })
        });

        // alien lasers with player ship
        alienLasers.lasers.forEach(laser => {
            if(Collisions.detectCirclePointCollision(spaceShip, laser)) {
                laser.isDead = true; 
                playerHit(); 
            }
        }); 

        // asteroids with player ship and player lasers
        asteroidManager.asteroids.forEach(asteroid => {
            spaceShipLasers.lasers.forEach(laser =>{
                if(!laser.isDead && Collisions.detectCirclePointCollision(asteroid, laser)) {
                    asteroidManager.explode(asteroid, particleSystemManager); 
                    laser.isDead = true; 
                    score += (80 - 20 * asteroid.size.sizeCategory); 
                }
            })
            if(!asteroid.isDead && Collisions.detectCircleCollision(spaceShip, asteroid)) {
                playerHit(); 
            }
        }); 
    }

    // ********************************************
    // ***************** Update *******************
    // ********************************************

    // update function manages end time update
    function update(elapsedTime) {
        // update all game objects
        gameKeyboard.update(elapsedTime);
        asteroidManager.update(elapsedTime);
        spaceShipLasers.update(elapsedTime);
        alienLasers.update(elapsedTime);
        alienShipManager.update(elapsedTime); 
        spaceShip.update(elapsedTime);
        particleSystemManager.update(elapsedTime); 
        highScoreManager.update(elapsedTime, score); 

        detectCollisions(); 
    }

    // *****************************************
    // ************* Render ********************
    // *****************************************
    function render() {
        graphics.context.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
        renderer.Laser.render(spaceShipLasers);
        renderer.Laser.render(alienLasers);
        renderer.Asteroid.render(asteroidManager);
        renderer.AlienShipManager.render(alienShipManager); 
        renderer.ParticleSystemManager.render(particleSystemManager);
        highScoreManager.render(); 
        renderer.SpaceShip.render(spaceShip); 
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

    return {
        restartGame: restartGame,
        run: run,
        initialize: initialize
    };

}(Game.game, Game.objects, Game.render, Game.graphics, Game.input, Game.highScores)); 
