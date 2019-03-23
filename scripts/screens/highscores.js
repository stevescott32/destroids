Game.screens['high-scores'] = (function(game) {
    'use strict';
    
    function initialize() {
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
         document.getElementById('id-high-scores-new-game').addEventListener(
            'click',
            function() { game.showScreen('game-play'); });
   }
    
    function run() {
          Game.highScores.render(); 
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(Game.game));
