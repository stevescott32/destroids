// singleton to detect collisions in the game
let Collisions = (function() {
    function detectCircleCollision(object1, object2) {
        let distanceSquared = Math.pow(object1.center.x - object2.center.x, 2) + 
            Math.pow(object1.center.y - object2.center.y, 2);
        let radiusSum = object1.radius + object2.radius;
        if (radiusSum * radiusSum > distanceSquared) {
            return true;
        }
        else {
            return false;
        }
    }

    let api = {
        detectCircleCollision: detectCircleCollision
    };

    return api; 
}());  
