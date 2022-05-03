import FindItScene from "./FindItScene.js";
export default class EndOfGame extends FindItScene {
  constructor() {
    super("endofgame");
  }

  preload() {
    super.preload();
    const url =
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridtableplugin.min.js";
    this.load.plugin("rexgridtableplugin", url, true);

    document.profile_pictures = [];
    document.air_console.getControllerDeviceIds().forEach((id) => {
      const asset_id = "profile_" + id;
      this.load.image(asset_id, document.air_console.getProfilePicture(id));
      document.profile_pictures[id] = asset_id;
    });
    this.DEBUG && console.log("profile pictures:");
    this.DEBUG && console.log(document.profile_pictures);
  }

  update() {
    super.update();
    if (document.ourScore) {
      // try selecting our score
      const ourScore = document.ourScore.ranks.world;
      let xth = '';
      switch(ourScore){
        case 1:
          xth = 'st';
          break;
        case 2:
          xth = 'nd';
          break;
        case 3:
          xth = 'rd';
        default:
          xth = 'th';
      }
      this.scoreText.setText(
        "The Game has ended!\nYour team spent a total of " +
          Math.floor(this.seconds * 10) / 10 +
          " seconds guessing.\n Your Team placed " +
          ourScore + xth +
          " in the world."
      );
    }
  }

  create() {
    super.create(roundAmount);

    // trigger game end on controllers
    var game_over_message = [];
    game_over_message.push({ type: "game_over" });
    this.DEBUG && console.log("sending game over message");
    document.air_console.broadcast(game_over_message);

    const uiScale = document.uiScale;
    var roundAmount = false;

    const cellwidth = 200 * uiScale;
    const cellheight = 64 * uiScale;
    const columnCount = 4;
    const rowCount = document.playerScores.length + 1;

    const cellsCount = columnCount * rowCount;
    const gridwidth = columnCount * cellwidth;
    const gridheight = rowCount * cellheight;

    document.graphics = this.graphics;

    document.wideCells = [];

    var newCellObject = function (scene, cell) {
      let cellText = "";
      let bgColor;
      let odd = false;
      let firstCellofRow = 0;

      // determine first cell of row, then determine if its an odd or even row based on that
      const remainder = cell.index % columnCount;
      if (remainder === 0) {
        firstCellofRow = cell.index;
      } else {
        firstCellofRow = cell.index - remainder;
      }
      const rowNumber = firstCellofRow / columnCount;
      if (rowNumber % 2 === 0) {
        // odd
        odd = true;
      }

      this.DEBUG && console.log("row number:");
      console.log(rowNumber);

      // determine if this is the head row
      if (cell.index < columnCount) {
        bgColor = Phaser.Display.Color.HexStringToColor("#002171").color;
      } else if (odd) {
        bgColor = Phaser.Display.Color.HexStringToColor("#0d47a1").color;
      } else {
        bgColor = Phaser.Display.Color.HexStringToColor("#2962ff").color;
      }

      var cellBg = scene.add
        .graphics(0, 0)
        .fillStyle(bgColor)
        .fillRect(0, 0, 200 * uiScale, 64 * uiScale);

      switch (cell.index) {
        case 0:
          cellText = "Position";
          break;
        case 1:
          cellText = "Avatar";
          break;
        case 2:
          cellText = "Nickname";
          document.wideCells.push(cell.index);
          break;
        case 3:
          cellText = "Points";
          break;
        default:
          cellText = cell.index;
          break;
      }

      var image = null;
      // dont do this in head row
      if (rowNumber > 0) {
        switch (remainder) {
          case 0:
            cellText = document.playerScores[rowNumber - 1].position;
            break;
          case 1:
            var image_id =
              document.profile_pictures[
                document.playerScores[rowNumber - 1].player
              ];
            this.DEBUG && console.log("adding image from asset id " + image_id);
            image = scene.add.image(
              (200 / 2) * uiScale,
              (64 / 2) * uiScale,
              image_id
            );
            image.displayWidth = cell.height;
            image.displayHeight = cell.height;
            break;
          case 2:
            cellText = document.air_console.getNickname(
              document.playerScores[rowNumber - 1].player
            );
            document.wideCells.push(cell.index);
            break;
          case 3:
            cellText = document.playerScores[rowNumber - 1].correct;
            break;
        }
      }

      var container;
      this.DEBUG && console.log();
      if (image !== null) {
        this.DEBUG && console.log("we should be adding the image");
        container = scene.add.container(0, 0, [cellBg, image]);
      } else {
        var txt = scene.add
          .text((200 / 2) * uiScale, (64 / 2) * uiScale, cellText, {
            fontSize: 35 * uiScale + "px",
            fontFamily: "Luckiest Guy",
          })
          .setOrigin(0.5, 0.5);
        container = scene.add.container(0, 0, [cellBg, txt]);
      }

      return container;
    }.bind(this);

    var onCellVisible = function (cell) {
      cell.setContainer(newCellObject(this, cell));
      //console.log('Cell ' + cellIdx + ' visible');
    };

    var table = this.add.rexGridTable(
      this.getCenterX(),
      this.getCenterY(),
      gridwidth,
      gridheight,
      {
        cellHeight: cellheight,
        cellWidth: cellwidth,
        cellsCount: cellsCount,
        columns: columnCount,
        cellVisibleCallback: onCellVisible.bind(this),
      }
    );

    console.log("initiating end of game screen");

    this.seconds = 0;
    this.seconds = document.timeElapsed / 1000;
    if (document.highScoreValid === true) {
      const negativePointsPerSecond = 1000 / (15 * document.maxRound);
      const points = Math.floor(1000 - negativePointsPerSecond * this.seconds);
      if(points < 0){
        points = 0;
      }  

      const uids = [];
      document.air_console.getControllerDeviceIds().forEach((id) => {
        uids.push(document.air_console.getUID(id));
      });
      const levelname =
        document.maxRound +
        " Rounds - " +
        document.savedRoundPlayers +
        " Players";
      const levelversion = document.maxRound + "-" + document.savedRoundPlayers;
      document.air_console.storeHighScore(
        levelname,
        levelversion,
        points,
        uids,
        {
          rounds: document.maxRound,
          players: document.savedRoundPlayers,
          seconds: this.seconds,
        },
        points + " points"
      );
      document.air_console.requestHighScores(levelname, levelversion);
    }

    this.scoreText = this.add
      .text(
        this.getCenterX(),
        100 * uiScale,
        "The Game has ended!\nYour team spent a total of " +
          Math.floor(this.seconds * 10) / 10 +
          " seconds guessing.",
        {
          fontSize: 45 * uiScale + "px",
          align: "center",
          color: "#ffffff",
          fontFamily: "Luckiest Guy",
        }
      )
      .setOrigin(0.5, 0.5);
  }
}
