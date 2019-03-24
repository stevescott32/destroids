/**
 * Life Manager: Keep track of lives, print lives
 * to doc.
 * managerSpec = { lives: }
 */
Game.objects.LifeManager = (function (managerSpec) {
  let livesLeft = managerSpec.lives;

  function loseLife() {
    livesLeft--;
    displayLivesLeft(); 
  }

  function startGame() {
    livesLeft = managerSpec.lives;
    displayLivesLeft(); 
  }

  function isGameOver() {
    return (livesLeft < 1);
  }

  function displayLivesLeft() {
    let livesLeftElement = document.getElementById('id-lives-left');
    if (livesLeftElement) {
      while (livesLeftElement.firstChild) {
        livesLeftElement.removeChild(livesLeftElement.firstChild);
      }
      let pElement = document.createElement('p');
      let textElement = document.createTextNode('Lives Left: ' + livesLeft); 
      pElement.appendChild(textElement);
      livesLeftElement.appendChild(pElement);
    }
  }

  let api = {
    startGame: startGame,
    loseLife: loseLife,
    isGameOver: isGameOver
  };

  return api;
}); 
