import FindItScene from "./FindItScene.js";
export default class HighScore extends FindItScene {
  constructor() {
    super("highscore");
  }

  preload() {
    super.preload();
    const url =
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridtableplugin.min.js";
    this.load.plugin("rexgridtableplugin", url, true);

    document.profile_pictures = [];
    air_console.getControllerDeviceIds().forEach((id) => {
      const asset_id = "profile_" + id;
      this.load.image(asset_id, air_console.getProfilePicture(id));
      document.profile_pictures[id] = asset_id;
    });
    DEBUG && console.log("profile pictures:");
    DEBUG && console.log(document.profile_pictures);
  }

  update() {
    super.update();
    const uiScale = document.uiScale;
    if (document.highScoreSettingChanged) {
      this.scoreText.setText("Loading HighScores...");
      const levelname =
        document.highScoreRounds +
        " Rounds - " +
        document.highScorePlayers +
        " Players";
      const levelversion =
        document.highScoreRounds + "-" + document.highScorePlayers;
      air_console.requestHighScores(levelname, levelversion);
      document.highScoreSettingChanged = false;
      document.scores = false;
    }
    if (document.scores) {
      // cache profile pictures
      let loader = new Phaser.Loader.LoaderPlugin(this);
      let requested = [];
      document.scores.forEach((score) => {
        const uids = score.uids;
        uids.forEach((uid) => {
          const image_id = "user_" + uid;
          if (!requested.includes(image_id)) {
            loader.image(
              image_id,
              air_console.getProfilePicture(
                uid,
                Math.floor(110 * document.uiScale)
              )
            );
            requested.push(image_id);
          }
        });
      });

      loader.once(Phaser.Loader.Events.COMPLETE, () => {
        // attempt to draw the high score table
        this.scoreText.setText("HighScores");
        this.regionText.setText(
          document.highScoreRegion +
            " - " +
            document.highScorePlayers +
            " Player" +
            (document.highScorePlayers > 1 ? "s" : "") +
            " - " +
            document.highScoreRounds +
            " Rounds"
        );

        const cellwidth = 200 * uiScale;
        const cellheight = 64 * uiScale;
        const columnCount = 4;
        const rowCount = document.scores.length + 1;

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

          DEBUG && console.log("row number:");
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
              cellText = "Time";
              break;
            default:
              cellText = cell.index;
              break;
          }

          var image = null;
          // dont do this in head row
          if (rowNumber > 0) {
            // select random uid from array for this row
            let uids = document.scores[rowNumber - 1].uids;
            let array_index = Math.floor(Math.random() * uids.length);
            let uid = uids[array_index];
            let image_id = "user_" + uid;
            let seconds = 0;

            switch (remainder) {
              case 0:
                cellText =
                  document.scores[rowNumber - 1].ranks[
                    document.highScoreRegion
                  ];
                break;
              case 1:
                DEBUG && console.log("adding image from asset id " + image_id);
                image = scene.add.image(
                  (200 / 2) * uiScale,
                  (64 / 2) * uiScale,
                  image_id
                );
                image.displayWidth = cell.height;
                image.displayHeight = cell.height;
                break;
              case 2:
                cellText =
                  document.scores[rowNumber - 1].nicknames[array_index];
                document.wideCells.push(cell.index);
                break;
              case 3:
                seconds = document.scores[rowNumber - 1].data.seconds;
                if (seconds > 60) {
                  minutes = Math.floor(seconds / 60);
                  if (minutes < 10) {
                    celltext =
                      "0" + minutes + ":" + (seconds > 10 ? "0" : "") + seconds;
                  } else {
                    celltext =
                      minutes + ":" + (seconds > 10 ? "0" : "") + seconds;
                  }
                } else {
                  cellText = seconds;
                }
                break;
            }
          }

          var container;
          DEBUG && console.log();
          if (image !== null) {
            DEBUG && console.log("we should be adding the image");
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
        };

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
        document.scores = false;
      });
      loader.start();
    }
  }

  create() {
    super.create(roundAmount);

    const uiScale = document.uiScale;
    var roundAmount = false;

    this.scoreText = this.add
      .text(this.getCenterX(), 100 * uiScale, "Loading HighScores...", {
        fontSize: 45 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0.5);

    this.regionText = this.add
      .text(this.getCenterX(), 200 * uiScale, "", {
        fontSize: 45 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0.5);
  }
}
