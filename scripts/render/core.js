Game.graphics = (function() {
    'use strict';
    console.log('Initializing graphics'); 

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        //console.log("texture");
        //console.log(image); 
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    function drawCircle(x, y, radius) {
        context.save(); 

        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI); 
        context.strokeStyle = "green"; 
        context.stroke(); 

        context.restore(); 
    }

    function drawText(spec) {
        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';

        context.translate(spec.position.x, spec.position.y);
        context.rotate(spec.rotation);
        context.translate(-spec.position.x, -spec.position.y);


        context.fillText(spec.text, spec.position.x, spec.position.y);
        context.strokeText(spec.text, spec.position.x, spec.position.y);

        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        get context() { return context; }, 
        clear: clear,
        drawTexture: drawTexture,
        drawText: drawText, 
        drawCircle: drawCircle
    };

    return api;
}());
