Game = (function (objects, renderer, graphics, input, highScoreManager) {
    console.log('Starting game main');

    let inputBuffer = {};
    let gameKeyboard = input.Keyboard();


    // time
    let current = performance.now();
    let past = current;
    let elapsedTime = current - past; //initialized to 0
    let accumulatedTime = 0;
    let startTime = performance.now();
    let quit = false;

    // highScores
    let highScoresInitialized = false;
    let score = 0;

    // objects
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

    let spaceShipLasers = objects.LaserManager({
        imageSrc: 'resources/images/laser.png',
        maxX: graphics.canvas.height,
        maxY: graphics.canvas.width,
        interval: 200 // milliseconds
    });

    function shoot(elapsedTime) {
        let center = {
            x: spaceShip.center.x,
            y: spaceShip.center.y
        };
        let size = {
            width: 25,
            height: 15
        };
        let spec = {
            center: center,
            size: size,
            speed: 1,
            rotation: spaceShip.rotation
        };
        spaceShipLasers.addLaser(spec);
    }

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

    gameKeyboard.register('ArrowUp', spaceShip.thrust);
    gameKeyboard.register('ArrowLeft', spaceShip.rotateLeft);
    gameKeyboard.register('ArrowRight', spaceShip.rotateRight);
    gameKeyboard.register('x', shoot);
    gameKeyboard.register('Space', shoot);

    // ********************************************
    // *************** Buttons ********************
    // ********************************************

    // restart the game, resetting all needed values
    function restartButton() {
        endGame();
        quit = false;
        highScoreManager.removeHighScoreNotification();
        spaceShip.newGame();
        initialize();
    }

    function clearHighScores() {
        highScoreManager.clearHighScores();
        asteroidManager.addAsteroid({
            center: {
                x: 300,
                y: 300
            },
            size: {
                height: 50,
                width: 50
            },
            rotation: 2.5 * Math.PI / 2,
            rotationSpeed: Math.PI / 16,
            speed: -40
        });
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

        highScoreManager.displayHighScores();
        highScoreManager.displayCurrentScore(current - startTime, score);
    }


    function gameLoop() {
        current = performance.now();
        elapsedTime = current - past;
        past = current;
        update(elapsedTime);
        render();

        if (!quit) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        startTime = performance.now();
        current = performance.now();
        past = performance.now();
        accumulatedTime = 0;
        
        score = 0;

        window.addEventListener('keydown', function (event) {
            inputBuffer[event.key] = event.key;
        });

        requestAnimationFrame(gameLoop);
    }
    initialize();

    // quit the game 
    function endGame() {
        quit = true;
        currentTime = performance.now();
        highScoreManager.checkForHighScores(currentTime - startTime, score);
        highScoreManager.displayHighScores();
        highScoreManager.storeHighScores();
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
        restartGame: restartButton
    };

}(Game.objects, Game.render, Game.graphics, Game.input, Game.highScores)); 
