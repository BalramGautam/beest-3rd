var snakeGame = (function () {

  // Editable variables
  var snakeColor = "green";
  var snakeHeadColor = "darkgreen";
  var foodColor = "yellow";
  var biteColor = "red";

  var gridSize = 49;

  var scoreIncrement = 50;

  var interval = 750;

  // Uneditable variables
  var grid =
    document.getElementsByClassName(
      "grid-container"
    )[0];

  var direction = -1;

  var foodPosition = -1;

  var lastFoodEaten = true;

  var score = 0;

  var touchDevice = false;

  var snakeTail = [];

  var previousPos = -1;

  var snakeIsDead = false;

  var gridSqRoot = Math.sqrt(gridSize);

  var snakePosition =
    (gridSize + gridSqRoot) / 2;

  var touchY = -1;
  var touchX = -1;

  var snakeMoving = false;

  // Resize event
  window.addEventListener("resize", function () {
    resizeGrid();
  });

  // Load event
  window.addEventListener("load", function () {

    document.body.style.background =
      "#" +
      Math.floor(
        Math.random() * 16777215
      ).toString(16);

    createCSScolumns();

    createBlocks();

    resizeGrid();

    if (is_touch_device()) {
      touchDevice = true;
    }

    _game.resetModal();
  });

  // Touch start
  document.addEventListener(
    "touchstart",
    function (event) {

      touchX = event.touches[0].pageX;

      touchY = event.touches[0].pageY;
    }
  );

  // Touch end
  document.addEventListener(
    "touchend",
    function (event) {

      var swipeX =
        touchX - event.changedTouches[0].pageX;

      var swipeY =
        touchY - event.changedTouches[0].pageY;

      if (
        Math.abs(swipeX) >
          window.innerWidth / 10 ||
        Math.abs(swipeY) >
          window.innerHeight / 10
      ) {

        if (
          Math.abs(swipeX) >
          Math.abs(swipeY)
        ) {

          if (swipeX > 0) {

            _game.changeDirection(0);

          } else {

            _game.changeDirection(1);

          }

        } else {

          if (swipeY > 0) {

            _game.changeDirection(3);

          } else {

            _game.changeDirection(2);

          }
        }
      }
    }
  );

  // Keyboard controls
  document.addEventListener(
    "keydown",
    function (event) {

      if (event.keyCode == "38") {

        _game.changeDirection(3);

      } else if (event.keyCode == "40") {

        _game.changeDirection(2);

      } else if (event.keyCode == "37") {

        _game.changeDirection(0);

      } else if (event.keyCode == "39") {

        _game.changeDirection(1);

      }
    }
  );

  // Resize grid
  function resizeGrid() {

    if (
      window.innerWidth >
      window.innerHeight
    ) {

      grid.style.width =
        window.innerHeight + "px";

      grid.style.height = "";

      grid.style.marginLeft =
        (window.innerWidth -
          grid.clientWidth) / 2 +
        "px";

      grid.style.marginTop = 0;

    } else {

      grid.style.height =
        window.innerWidth + "px";

      grid.style.width = "";

      grid.style.marginTop =
        (window.innerHeight -
          grid.clientHeight) / 2 +
        "px";

      grid.style.marginLeft = 0;
    }
  }

  // Create blocks
  function createBlocks() {

    for (var i = 0; i < gridSize; i++) {

      var blockDiv =
        document.createElement("div");

      blockDiv.id = "block" + i;

      grid.appendChild(blockDiv);
    }
  }

  // Create CSS columns
  function createCSScolumns() {

    var columnsString = "";

    for (
      var i = 0;
      i < gridSqRoot;
      i++
    ) {

      columnsString +=
        100 / gridSqRoot + "% ";
    }

    grid.style.gridTemplateColumns =
      columnsString;
  }

  // Detect touch device
  function is_touch_device() {

    return (
      "ontouchstart" in window ||
      navigator.MaxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  var _game = {

    getInterval: function () {
      return interval;
    },

    setInterval: function (val) {
      interval = val;
    },

    // Draw board
    drawBoard: function () {

      for (
        var i = 0;
        i < grid.children.length;
        i++
      ) {

        grid.children[i].style.background =
          "";
      }

      // Tail
      for (
        var j = 0;
        j < snakeTail.length;
        j++
      ) {

        document.getElementById(
          "block" + snakeTail[j]
        ).style.background = snakeColor;
      }

      // Head
      if (!snakeIsDead) {

        document.getElementById(
          "block" + snakePosition
        ).style.background =
          snakeHeadColor;

      } else {

        document.getElementById(
          "block" + snakePosition
        ).style.background = biteColor;
      }

      // Food
      document.getElementById(
        "block" + foodPosition
      ).style.background = foodColor;

      // Score
      document.getElementById(
        "scoreboard"
      ).textContent =
        "Souls = " + score;
    },

    // Play game
    play: function () {

      _game.moveSnake();

      _game.checkForDeath();

      _game.tryToEatFood();

      if (lastFoodEaten) {
        _game.placeFood();
      }

      _game.drawBoard();

      if (!snakeIsDead) {

        setTimeout(
          _game.play,
          _game.getInterval()
        );
      }
    },

    // Move snake
    moveSnake: function () {

      snakeMoving = true;

      previousPos = snakePosition;

      switch (direction) {

        // Left
        case 0:

          if (snakePosition >= 0) {

            if (
              snakePosition %
                gridSqRoot ===
              0
            ) {

              snakePosition +=
                gridSqRoot - 1;

            } else {

              snakePosition--;
            }

          } else {

            _game.moveSnake();
          }

          break;

        // Right
        case 1:

          if (
            snakePosition + 1 <=
            gridSize
          ) {

            if (
              snakePosition %
                gridSqRoot ===
              gridSqRoot - 1
            ) {

              snakePosition -=
                gridSqRoot - 1;

            } else {

              snakePosition++;
            }

          } else {

            _game.moveSnake();
          }

          break;

        // Down
        case 2:

          if (
            snakePosition +
              gridSqRoot <
            gridSize
          ) {

            snakePosition +=
              gridSqRoot;

          } else {

            snakePosition -=
              gridSize - gridSqRoot;
          }

          break;

        // Up
        case 3:

          if (
            snakePosition -
              gridSqRoot >=
            0
          ) {

            snakePosition -=
              gridSqRoot;

          } else {

            snakePosition +=
              gridSize - gridSqRoot;
          }

          break;

        default:
          break;
      }

      // Update tail
      snakeTail.unshift(previousPos);

      snakeTail.pop();

      snakeMoving = false;
    },

    // Change direction
    changeDirection: function (
      newDirection
    ) {

      if (
        _game.checkLegalMove(
          newDirection
        )
      ) {

        direction = newDirection;
      }
    },

    // Eat food
    tryToEatFood: function () {

      if (
        snakePosition === foodPosition
      ) {

        lastFoodEaten = true;

        score += scoreIncrement;

        if (snakeTail.length > 0) {

          snakeTail.push(
            snakeTail[
              snakeTail.length - 1
            ]
          );

        } else {

          snakeTail.unshift(
            previousPos
          );
        }

        if (score === 150) {

          interval = 500;

        } else if (score === 300) {

          interval = 350;

        } else if (score === 500) {

          interval = 250;

        } else if (score === 750) {

          interval = 200;

        } else if (score === 1000) {

          interval = 175;

        } else if (score === 1500) {

          document.getElementById(
            "modal"
          ).innerHTML =
            "<h1>Teriyaki Sauce Chicken Dinner!</h1><button onclick='snakeGame.hideModal();'>Play Again</button>";

          snakeIsDead = true;

          _game.changeDirection(-1);

          _game.showModal();
        }
      }
    },

    // Place food
    placeFood: function () {

      lastFoodEaten = false;

      foodPosition =
        Math.floor(
          Math.random() * 36
        );

      while (
        foodPosition ===
          snakePosition ||
        snakeTail.indexOf(
          foodPosition
        ) > -1
      ) {

        foodPosition =
          Math.floor(
            Math.random() * 36
          );
      }
    },

    // Death check
    checkForDeath: function () {

      if (
        snakeTail.indexOf(
          snakePosition
        ) > -1
      ) {

        snakeIsDead = true;

        _game.changeDirection(-1);

        setTimeout(
          _game.showModal,
          2000
        );
      }
    },

    // Legal move
    checkLegalMove: function (
      newDirection
    ) {

      if (snakeMoving) {
        return false;
      }

      var legalMove = true;

      // Left
      if (
        newDirection === 0 &&
        (
          snakeTail[0] ===
            snakePosition - 1 ||
          snakeTail[0] ===
            snakePosition +
              gridSqRoot -
              1
        )
      ) {
        legalMove = false;
      }

      // Right
      if (
        newDirection === 1 &&
        (
          snakeTail[0] ===
            snakePosition + 1 ||
          snakeTail[0] ===
            snakePosition -
              gridSqRoot +
              1
        )
      ) {
        legalMove = false;
      }

      // Down
      if (
        newDirection === 2 &&
        (
          snakeTail[0] ===
            snakePosition +
              gridSqRoot ||
          snakeTail[0] ===
            snakePosition -
              gridSize +
              gridSqRoot
        )
      ) {
        legalMove = false;
      }

      // Up
      if (
        newDirection === 3 &&
        (
          snakeTail[0] ===
            snakePosition -
              gridSqRoot ||
          snakeTail[0] ===
            snakePosition +
              gridSize -
              gridSqRoot
        )
      ) {
        legalMove = false;
      }

      return legalMove;
    },

    // Hide modal
    hideModal: function () {

      document.getElementById(
        "modal"
      ).style.display = "none";

      // Reset values
      snakeIsDead = false;

      snakePosition = 21;

      snakeTail = [];

      interval = 750;

      score = 0;

      direction = -1;

      _game.placeFood();

      _game.resetModal();

      // Start game
      _game.play();
    },

    // Show modal
    showModal: function () {

      document.getElementById(
        "modal"
      ).style.display = "";
    },

    // Reset modal
    resetModal: function () {

      document.getElementById(
        "modal"
      ).innerHTML =
        '<h1 class="font-weight-bold">How to play</h1>' +
        "<h2>Keyboard Buttons</h2>" +
        "<div>Press Up-Down-Right-Left arrows to change your snek direction</div><br>" +
        "<h2>Touchscreen Buttons</h2>" +
        "<div>Swipe on the screen to change your snek direction</div><br>" +
        "<h2>Game goal</h2>" +
        "<div>Try eating the food blocks (yellow) to get as big as possible</div><br>" +
        "<button onclick='snakeGame.hideModal();'>Start</button>";
    }
  };

  return _game;

})();