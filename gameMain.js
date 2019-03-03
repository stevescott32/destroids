Game = (function (objects, renderer, graphics, input, highScoreManager) {
    console.log('Starting game main');

    let inputBuffer = {};
    let gameKeyboard = input.Keyboard();

    // time
    let lastTimeStamp = performance.now();
    let elapsedTime = 0; 
    let startTime = performance.now();
    let quit = false;

    // current score
    let score = 0;

    // ********************************************
    // ********* Objects for the game *************
    // ********************************************

    // player spaceship. starts in the middle of the screen
    let spaceShip = objects.SpaceShip({
        imageSrc: 'resources/images/spaceship-main.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
        size: { width: 80, height: 80 },
        radius: 35,
        canvasHeight: graphics.canvas.height,
        canvasWidth: graphics.canvas.width,
        thrust: 500 / 1000,
        rotationRate: Math.PI / 16, // radians per second
        crashed: false,
    });

    // manager for all lasers fired by player spaceship
    let spaceShipLasers = objects.LaserManager({
        imageSrc: 'resources/images/laser.png',
        maxX: graphics.canvas.height,
        maxY: graphics.canvas.width,
        interval: 200 // milliseconds
    });

    // manager for all asteroids in the game
    let asteroidManager = objects.AsteroidManager({
        imageSrc: "resources/images/asteroid.png",
        maxX: graphics.canvas.height,
        maxY: graphics.canvas.width,
        maxSize: 200,
        minSize: 50, 
        maxSpeed: 150,
        minSpeed: 50,
        interval: 1 // seconds
    });

    // ********************************************
    // *********** Keyboard actions ***************
    // ********************************************

    function playerShoot() {
        spaceShipLasers.addLaser(spaceShip.shoot())
    }

    gameKeyboard.register('ArrowUp', spaceShip.thrust);
    gameKeyboard.register('ArrowLeft', spaceShip.rotateLeft);
    gameKeyboard.register('ArrowRight', spaceShip.rotateRight);
    gameKeyboard.register(' ', playerShoot);

    // ********************************************
    // ********** Changing Game State *************
    // ********************************************

    // start a new game, resetting all objects
    function startGame() {
        quit = false;
        score = 0;
        inputBuffer = {};
        spaceShip.startGame();
        asteroidManager.startGame(); 
        highScoreManager.startGame(); 
        spaceShip.crashed = false; 
        startTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    // stop gameplay, updating state 
    function endGame() {
        quit = true;
        let totalTime = performance.now() - startTime; 
        score = asteroidManager.asteroidScore;  
        highScoreManager.endGame(score); 
    }

    // set up the game the first time it is loaded
    function initialize() {
        window.addEventListener('keydown', function (event) {
            inputBuffer[event.key] = event.key;
        });
        startGame(); 
    }

    // ********************************************
    // ***************** Update *******************
    // ********************************************

    // update function manages end time update
    function update(elapsedTime) {
        gameKeyboard.update(elapsedTime);
        asteroidManager.update(elapsedTime);
        spaceShip.update(elapsedTime);
        spaceShipLasers.update(elapsedTime);
        asteroidManager.detectLaserCollisions(spaceShipLasers);
        score = asteroidManager.asteroidScore; 
        highScoreManager.update(elapsedTime, score); 

        if (!spaceShip.crashed && asteroidManager.detectCircleCollision(spaceShip.center, spaceShip.radius)) {
            spaceShip.crashed = true;
            endGame(); 
        }
    }

    // *****************************************
    // ************* Render ********************
    // *****************************************
    function render() {
        graphics.context.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
        renderer.Laser.render(spaceShipLasers);
        renderer.Asteroid.render(asteroidManager);
        renderer.SpaceShip.render(spaceShip);
        highScoreManager.render(); 
    }


    function gameLoop() {
        elapsedTime = performance.now() - lastTimeStamp;
        lastTimeStamp = performance.now(); 
        update(elapsedTime);
        render();

        if (!quit) {
            requestAnimationFrame(gameLoop);
        }
    }
    initialize();

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

    function developerCredits() {
        let message = "Game Development: Steven Scott"
            + "\nGame Testing: Shane Canfield, Katie Taylor"
            + "\nGame Art: http://millionthvector.blogspot.de"
            + "https://ya-webdesign.com/download.html?utm_source=gg#gal_445279";
        alert(message);
    }
    return {
        developerCredits: developerCredits,
        clearHighScores: clearHighScores,
        restartGame: restartGame
    };

}(Game.objects, Game.render, Game.graphics, Game.input, Game.highScores)); 
