/**
 * Life Manager: Keep track of lives, print lives
 * to doc.
 * managerSpec = { lives: }
 */
Game.objects.LifeManager = (function (managerSpec) {
  console.log('Initializing life manager'); 
  let livesLeft = managerSpec.lives; 

  function loseLife() {
    livesLeft--; 
  }

  function startGame() {
    livesLeft = managerSpec.lives; 
  }

  function isGameOver() {
    return (livesLeft < 1); 
  }

  function render() {
    console.log('Rendering life manager'); 
  }

  let api = {
    startGame: startGame,
    loseLife: loseLife,
    isGameOver: isGameOver,
    render: render
  };

  return api; 
}); 
