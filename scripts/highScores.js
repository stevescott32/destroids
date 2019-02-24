
// ************************************************
// ****************** Scoring *********************
// ************************************************

Game.highScores = (function getHighScoreManager() {
  // print the current score out to the screen 
  let highScores = []; 
  getHighScores(); 

  function displayCurrentScore(time, score) {
    let scoreParent = document.getElementById('current-game-stats');

    while (scoreParent && scoreParent.firstChild) {
      scoreParent.removeChild(scoreParent.firstChild);
    }

    let scoreText = 'Current Score: ' + score;
    let timeText = 'Time: ' + Math.round(time / 1000) + ' seconds';
    let scoreChild = document.createElement('P');
    let timeChild = document.createElement('P');
    let scoreTextNode = document.createTextNode(scoreText);
    let timeTextNode = document.createTextNode(timeText);

    scoreChild.appendChild(scoreTextNode);
    timeChild.appendChild(timeTextNode);
    scoreParent.appendChild(scoreChild);
    scoreParent.appendChild(timeChild);
  }

  // print the high score list
  function displayHighScores() {
    let highScoresList = document.getElementById('highScoresList');
    if (highScoresList) {
      while (highScoresList.firstChild) {
        highScoresList.removeChild(highScoresList.firstChild);
      }
      if (highScores) {
        for (let i = 0; i < highScores.length; i++) {
          let newHighScore = document.createElement('p');
          let newHighScoreText = document.createTextNode('Score: ' +
            highScores[i].score + ' --> Time: ' + Math.round(highScores[i].time / 1000) + ' seconds');
          newHighScore.appendChild(newHighScoreText);
          highScoresList.appendChild(newHighScore);
        }
      }
      highScoresInitialized = true;
    }
  }

  // remove the high score notification after a new game has started
  function removeHighScoreNotification() {
    let notifyParent = document.getElementById('notify-of-high-score');

    while (notifyParent && notifyParent.firstChild) {
      notifyParent.removeChild(notifyParent.firstChild);
    }
  }

  // let the user know what their high score was and celebrate their achievement 
  function notifyOfNewHighScore(score, time) {
    let notifyParent = document.getElementById('notify-of-high-score');

    let text = 'You just created a new high score!!!';
    let stats = 'Score: ' + score + ' --> Time: ' + Math.round(time / 1000) + ' seconds';
    let textChild = document.createElement('P');
    let statsChild = document.createElement('P');
    let notificationText = document.createTextNode(text);
    let statsText = document.createTextNode(stats);

    textChild.appendChild(notificationText);
    statsChild.appendChild(statsText);
    notifyParent.appendChild(textChild);
    notifyParent.appendChild(statsChild);
  }

  // see if the current score makes it into the high score list
  function checkForHighScores(endTime, startTime) {
    let highScoreAdded = false;
    let totalTime = endTime - startTime;
    if (!highScores || highScores.length == 0) {
      highScores.push({ score: score, time: totalTime });
      highScoreAdded = true;
    }
    else {
      let hsLength = highScores.length;
      for (let s = 0; s < hsLength; s++) {
        if (!highScoreAdded && score >= highScores[s].score) {
          highScores.splice(s, 0, { score: score, time: totalTime });
          highScoreAdded = true;
          break;
        }
      }
    }
    if (highScores.length > 5) {
      for (let tooMany = highScores.length; tooMany > 5; tooMany--) {
        highScores.pop();
      }
    }
    else if (highScores.length < 5 && !highScoreAdded) {
      highScores.push({ score: score, time: totalTime });
      highScoreAdded = true;
    }
    if (highScoreAdded) {
      notifyOfNewHighScore(score, totalTime);
    }
  }

  // set high scores in local storage so they persist
  function storeHighScores() {
    let highScoreString = JSON.stringify(highScores);
    window.sessionStorage.setItem('highScores', highScoreString);
  }

  // retrieve all high scores from local storage
  function getHighScores() {
    let highScoresString = window.sessionStorage.getItem('highScores');
    if (highScoresString) {
      highScores = JSON.parse(highScoresString);
    }
    return highScores;
  }

  // clear existing high scores from screen and from storage
  function clearHighScoresButton() {
    removeHighScoreNotification();
    highScores = [];
    storeHighScores();
    getHighScores();
    displayHighScores();
  }

  return {
    displayCurrentScore: displayCurrentScore,
    displayHighScores: displayHighScores,
    checkForHighScores: checkForHighScores,
    getHighScores: getHighScores,
    storeHighScores: storeHighScores,
    notifyOfNewHighScore: notifyOfNewHighScore,
    removeHighScoreNotification: removeHighScoreNotification,
    clearHighScores: clearHighScoresButton
  }

})()
