Game = (function (objects, renderer, graphics, input, highScoreManager) {
    console.log('Starting game main'); 

    let inputBuffer = {};
    let gameKeyboard = input.Keyboard(); 

    // rendering

    // settings

    // time
    let startTime = performance.now();
    let endTime = performance.now();
    let quit = false;

    // highScores
    let highScoresInitialized = false;
    //let highScoreManager = highScores.getHighScoreManager();
    let score = 0;

    // objects
    let spaceShip = objects.SpaceShip({
        imageSrc: 'resources/images/spaceship-main.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2},
        size: { width: 100, height: 100 },
        speed: 50 / 1000 // pixels per millisecond
    }); 

    function message() {
        console.log('Message'); 
    }

    gameKeyboard.register('ArrowUp', spaceShip.moveUp); 
    gameKeyboard.register('ArrowDown', spaceShip.moveDown);
    gameKeyboard.register('ArrowLeft', spaceShip.rotateLeft);
    gameKeyboard.register('ArrowRight', spaceShip.rotateRight); 
    gameKeyboard.register('m', message()); 

    // *****************************************
    // ************* Rendering *****************
    // *****************************************
    function render() {
        graphics.context.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
        renderer.SpaceShip.render(spaceShip); 

        highScoreManager.displayHighScores();
        highScoreManager.displayCurrentScore(endTime - startTime, score);
    }

    // ********************************************
    // ************* Process Inputs ***************
    // ********************************************

    function movePlayerShip(key) {
        if (quit) { return; }
        if (key === 'ArrowDown' || key === 's' || key === 'k') {
            console.log('Down');
        }
        if (key == 'ArrowUp' || key === 'w' || key === 'i') {
            console.log('Up');
        }
        if (key == 'ArrowRight' || key === 'd' || key === 'l') {
            console.log('Right');
        }
        if (key == 'ArrowLeft' || key === 'a' || key === 'j') {
            console.log('Left');
        }
    }

    function processInput() {
        for (input in inputBuffer) {
            movePlayerShip(inputBuffer[input]);
            if (input == 'n') {
                restartButton();
            }
        }
        inputBuffer = {};
    }

    // ********************************************
    // *************** Buttons ********************
    // ********************************************

    // restart the game, resetting all needed values
    function restartButton() {
        quit = false;
        highScoreManager.removeHighScoreNotification();
        initialize();
    }

    function clearHighScores() {
        highScoreManager.clearHighScores(); 
    }

    // ********************************************
    // ***************** Update *******************
    // ********************************************

    // update function manages end time update
    function update(elapsedTime) {
        endTime = performance.now();
        spaceShip.update(elapsedTime); 
        gameKeyboard.update(elapsedTime); 
    }

    function gameLoop() {
        let elapsedTime = 200;// todo change this to be correct 
        processInput();
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    function initialize() {
        startTime = performance.now();
        score = 0;

        window.addEventListener('keydown', function (event) {
            inputBuffer[event.key] = event.key;
        });

        requestAnimationFrame(gameLoop);
    }

    // quit the game 
    function endGame() {
        quit = true;
        endTime = performance.now();
        highScoreManager.checkForHighScores(endTime - startTime, score);
        highScoreManager.displayHighScores();
        highScoreManager.storeHighScores();
    }

    function developerCredits() {
        let message = "Game Development: Steven Scott"
            + "\nGame Testing: Shane Canfield, Katie Taylor"
            + "\nGame Art: http://millionthvector.blogspot.de";
        alert(message);
    }
    initialize(); 
    return {
        developerCredits: developerCredits,
        clearHighScores: clearHighScores,
        restartGame: restartButton
    }; 

}(Game.objects, Game.render, Game.graphics, Game.input, Game.highScores)); 
