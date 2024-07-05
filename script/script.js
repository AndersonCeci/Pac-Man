document.addEventListener("DOMContentLoaded", (event) => {
  const grid = document.querySelector(".grid");
  let scoreDisplay = document.querySelector(".score");
  let scoreDisplayWon = document.querySelector(".score-span");
  let winMessage = document.querySelector(".win-message");
  let winScoreDisplay = document.querySelector(".win-score");
  let gameOverMessage = document.querySelector(".game-over-message");
  let gameOverScore = document.querySelector(".game-over-score");
  let gameOverDisplay = document.querySelector(".game-over-score-span");
  const heartsContainer = document.getElementById("hearts-container");
  let healthName = document.querySelector(".lives-h1");
  let healthDiv = document.querySelector(".lives-div");

  let lives = 3;
  let width = 22;
  let score = 0;
  let pacmanIndex = 70;

  let ghostScared = false;
  let gameOver = false;

  const layoutMap = [
    5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1,
    1, 0, 5, 1, 1, 0, 0, 5, 1, 6, 0, 0, 1, 1, 1, 6, 0, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 2, 0, 0, 1, 2, 1, 0, 0, 1, 2, 2, 1, 0, 1, 0, 0, 0, 1,
    1, 4, 1, 0, 0, 0, 0, 1, 2, 1, 0, 0, 1, 2, 2, 1, 0, 1, 0, 4, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1, 2, 1, 0, 4, 1, 2, 2, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1, 2, 1, 0, 0, 1, 2, 2, 1, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1, 2, 1, 0, 0, 1, 2, 2, 1, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1, 2, 1, 0, 0, 1, 2, 2, 1, 0, 1, 0, 0, 0, 1,
    1, 0, 8, 1, 1, 0, 0, 8, 1, 7, 0, 0, 1, 1, 1, 7, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
    8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7,
  ];

// 0: Food
// 1: Wall
// 2: Empty space
// 3: Pink ghost starting position
// 4: Power-up
// 5-8: Rounded wall corners
// 9: Blue ghost starting position


  const squares = [];


// Updates the display of remaining lives with heart icons.

  function updateLivesDisplay() {
    heartsContainer.innerHTML = "";

    for (let i = 0; i < lives; i++) {
      const heartImg = document.createElement("img");
      heartImg.src = "images/heart.png";
      heartImg.classList.add("heart");
      heartsContainer.appendChild(heartImg);
    }
  }

  updateLivesDisplay();

  // Creates the game map based on the layoutMap array.
  function createMap() {
    for (let i = 0; i < layoutMap.length; i++) {
      const square = document.createElement("div");
      grid.appendChild(square);
      squares.push(square);

      if (layoutMap[i] === 1) {
        squares[i].classList.add("wall");
      } else if (layoutMap[i] === 0) {
        squares[i].classList.add("food");
      } else if (layoutMap[i] === 3) {
        squares[i].classList.add("pink-ghost");
      } else if (layoutMap[i] === 9) {
        squares[i].classList.add("blue-ghost");
      } else if (layoutMap[i] === 4) {
        squares[i].classList.add("power-up");
      } else if (layoutMap[i] === 5) {
        squares[i].classList.add("wall");
        squares[i].classList.add("rounded-wall-top-left");
      } else if (layoutMap[i] === 6) {
        squares[i].classList.add("wall");
        squares[i].classList.add("rounded-wall-top-right");
      } else if (layoutMap[i] === 7) {
        squares[i].classList.add("wall");
        squares[i].classList.add("rounded-wall-bottom-right");
      } else if (layoutMap[i] === 8) {
        squares[i].classList.add("wall");
        squares[i].classList.add("rounded-wall-bottom-left");
      }
    }
    console.log("Map created. Total squares:", squares.length);
  }


// Checks if all food items are eaten to trigger a win condition.

  function checkWin() {
    const foodRemaining = squares.some(square => square.classList.contains('food'));
    if (!foodRemaining) {
      winMessage.style.display = "block";
      winScoreDisplay.style.display = "flex";
      healthName.style.display = "none";
      healthDiv.style.display = "none";
      document.removeEventListener("keydown", movePacman);
      clearInterval(pinkGhostInterval);
      clearInterval(blueGhostInterval);
      gameOver = true;
    }
  }

  // Checks if Pac-Man encounters a ghost, handles lives decrement and game over conditions.

  function checkGameOver() {
    if (squares[pacmanIndex].classList.contains("pink-ghost") || squares[pacmanIndex].classList.contains("blue-ghost")) {
      if (!ghostScared) {
        lives--;
        updateLivesDisplay();
        if (lives <= 0) {
          clearInterval(pinkGhostInterval);
          clearInterval(blueGhostInterval);
          gameOverMessage.style.display = "block";
          gameOverScore.style.display = "flex";
          healthName.style.display = "none";
          healthDiv.style.display = "none";
          document.removeEventListener("keydown", movePacman);
          gameOverDisplay.innerHTML = score;
          gameOverScore.innerHTML = score;
          gameOver = true;
        } else {
          squares[pacmanIndex].classList.remove("pac-man", "pac-man-up", "pac-man-down", "pac-man-left");
          pacmanIndex = 70;
          squares[pacmanIndex].classList.add("pac-man");
          ghostScared = false;
        }
      } else {
        score += 15;
        scoreDisplay.innerHTML = score;
        scoreDisplayWon.innerHTML = score;
        gameOverDisplay.innerHTML = score;

        let randomIndexPink, randomIndexBlue;

        do {
          randomIndexPink = Math.floor(Math.random() * squares.length);
        } while (squares[randomIndexPink].classList.contains("wall") || squares[randomIndexPink].classList.contains("pac-man"));

        do {
          randomIndexBlue = Math.floor(Math.random() * squares.length);
        } while (squares[randomIndexBlue].classList.contains("wall") || squares[randomIndexBlue].classList.contains("pac-man"));

        squares[pinkGhostIndex].classList.remove("pink-ghost", "ghost-scared-pink");
        squares[blueGhostIndex].classList.remove("blue-ghost", "ghost-scared-blue");

        pinkGhostIndex = randomIndexPink;
        blueGhostIndex = randomIndexBlue;

        squares[pinkGhostIndex].classList.add("pink-ghost");
        squares[blueGhostIndex].classList.add("blue-ghost");

        checkWin();
      }
    }
  }

  // Handles actions when Pac-Man eats a food item.

  function foodEaten() {
    if (squares[pacmanIndex].classList.contains("food")) {
      score++;
      scoreDisplay.innerHTML = score;
      scoreDisplayWon.innerHTML = score;
      gameOverDisplay.innerHTML = score;
      squares[pacmanIndex].classList.remove("food");
      checkWin();
    }
  }

  // Handles actions when Pac-Man eats a power-up food item.

  function powerUpFood() {
    if (squares[pacmanIndex].classList.contains("power-up")) {
      score += 15;
      scoreDisplay.innerHTML = score;
      scoreDisplayWon.innerHTML = score;
      gameOverDisplay.innerHTML = score;
      squares[pacmanIndex].classList.remove("power-up");
      squares[pacmanIndex].classList.remove("food");
      checkWin();

      ghostScared = true;
      squares[pinkGhostIndex].classList.add("ghost-scared");
      squares[blueGhostIndex].classList.add("ghost-scared");
      setTimeout(() => {
        ghostScared = false;
        squares[pinkGhostIndex].classList.remove("ghost-scared-blue");
        squares[blueGhostIndex].classList.remove("ghost-scared-pink");
      }, 5000);
    }
  }

  let pinkGhostIndex = layoutMap.indexOf(3);


// Moves the pink ghost randomly on the game grid.

  function movePinkGhost() {
    if (gameOver) return;

    const directions = [-1, +1, -width, +width];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    if (!squares[pinkGhostIndex + direction].classList.contains('wall') && !squares[pinkGhostIndex + direction].classList.contains('pink-ghost') && !squares[pinkGhostIndex + direction].classList.contains('blue-ghost')) {
      squares[pinkGhostIndex].classList.remove('pink-ghost', 'ghost-scared-pink');
      pinkGhostIndex += direction;
      squares[pinkGhostIndex].classList.add('pink-ghost');
      if (ghostScared) {
        squares[pinkGhostIndex].classList.add('ghost-scared-pink');
      }
    }
    checkGameOver();
  }

  let pinkGhostInterval = setInterval(movePinkGhost, 250);

  let blueGhostIndex = layoutMap.indexOf(9 );


// Moves the blue ghost randomly on the game grid.

  function moveBlueGhost() {
    if (gameOver) return;

    const directions = [-1, +1, -width, +width];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    if (!squares[blueGhostIndex + direction].classList.contains('wall') && !squares[blueGhostIndex + direction].classList.contains('pink-ghost') && !squares[blueGhostIndex + direction].classList.contains('blue-ghost')) {
      squares[blueGhostIndex].classList.remove('blue-ghost', 'ghost-scared-blue');
      blueGhostIndex += direction;
      squares[blueGhostIndex].classList.add('blue-ghost');
      if (ghostScared) {
        squares[blueGhostIndex].classList.add('ghost-scared-blue');
      }
    }
    checkGameOver();
  }

  let blueGhostInterval = setInterval(moveBlueGhost, 250);


// Moves Pac-Man based on keyboard arrow inputs.

  function movePacman(event) {
    if (gameOver) return;

    squares[pacmanIndex].classList.remove(
      "pac-man",
      "pac-man-up",
      "pac-man-down",
      "pac-man-left"
    );

    switch (event.key) {
      case "ArrowUp":
        if (!squares[pacmanIndex - width].classList.contains("wall")) {
          pacmanIndex -= width;
          squares[pacmanIndex].classList.add("pac-man-up");
        }
        break;
      case "ArrowDown":
        if (!squares[pacmanIndex + width].classList.contains("wall")) {
          pacmanIndex += width;
          squares[pacmanIndex].classList.add("pac-man-down");
        }
        break;
      case "ArrowLeft":
          if (!squares[pacmanIndex - 1].classList.contains("wall")) {
    pacmanIndex -= 1;
    squares[pacmanIndex].classList.add("pac-man-left");
  }
        break;
      case "ArrowRight":
        if (!squares[pacmanIndex + 1].classList.contains("wall")) {
          pacmanIndex += 1;
          squares[pacmanIndex].classList.add("pac-man");
        }
        break;
    }

    squares[pacmanIndex].classList.add("pac-man");
    foodEaten();
    powerUpFood();
    checkGameOver();
  }


// Restarts the game by reloading the page.
  function restartGame() {
    location.reload();
  }

  const restartButton = document.querySelector(".restart-div");
  restartButton.addEventListener("click", restartGame);

  document.addEventListener("keydown", movePacman);

  document.addEventListener("keydown", event => {
    if (event.key === 'r') {
      restartGame();
    }
  });

  createMap();

  squares[pacmanIndex].classList.add("pac-man");

  foodEaten();
});