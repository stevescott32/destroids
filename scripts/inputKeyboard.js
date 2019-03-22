Game.input.Keyboard = function () {
    let keyboard = {
        keys: {},
        handlers: {}
    };

    function keyPress(e) {
        keyboard.keys[e.key] = e.timeStamp;
    }

    function keyRelease(e) {
        delete keyboard.keys[e.key];
    }

    keyboard.update = function (elapsedTime) {
        for (let key in keyboard.keys) {
            if (keyboard.keys.hasOwnProperty(key)) {
                if (keyboard.handlers[key]) {
                    keyboard.handlers[key](elapsedTime);
                }
            }
        }
    };

    keyboard.register = function (key, handler) {
        keyboard.handlers[key] = handler;
    };

    keyboard.reset = function () {
        keyboard.handlers = {}; 
        keyboard.keys = {}; 
    }

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return keyboard;
};
