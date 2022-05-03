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
    const uiScale = document.uiScale;
    if (document.highScoreSettingChanged) {
      this.changeScoreText();
      let uids = [];
      document.air_console.getControllerDeviceIds().forEach((id) => {
        uids.push(document.air_console.getUID(id));
      });
      this.scoreText.setText("Loading HighScores...");
      const levelname =
        document.highScoreRounds +
        " Rounds - " +
        document.highScorePlayers +
        " Players";
      const levelversion =
        document.highScoreRounds + "-" + document.highScorePlayers;
      if (this.table !== undefined) {
        this.table.destroy();
      }
      document.air_console.requestHighScores(levelname, levelversion, uids, [
        document.highScoreRegion,
      ]);
      document.highScoreSettingChanged = false;
      document.scores = false;
    }
    if (document.scores && this.scoreBuildingInProgress == false) {
      if (document.scores.length === 0) {
        this.scoreText.setText("No Highscores for the selected settings");
      } else {
        this.scoreBuildingInProgress = true;
        // conventionally sort the scores
        document.scores.sort(function (a, b) {
          if (
            a.ranks[document.highScoreRegion] <
            b.ranks[document.highScoreRegion]
          ) {
            return -1;
          }
          if (
            a.ranks[document.highScoreRegion] >
            b.ranks[document.highScoreRegion]
          ) {
            return 1;
          }
          return 0;
        });

        // cache profile pictures
        let loader = new Phaser.Loader.LoaderPlugin(this);
        var requested = [];
        document.scores.forEach((score) => {
          const uids = score.uids;
          uids.forEach((uid) => {
            const image_id = "user_" + uid;
           this.DEBUG && console.log("requested image array:");
           this.DEBUG && console.log(requested);
            if (!requested.includes(image_id)) {
              loader.image(
                image_id,
                document.air_console.getProfilePicture(
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
          this.changeScoreText();

         this.DEBUG && console.log("document.scores used for highscore table:");
          console.log(document.scores);

          const cellwidth = 200 * uiScale;
          const cellheight = 64 * uiScale;
          const columnCount = 5;
          const rowCount = document.scores.length + 1;

          const cellsCount = columnCount * rowCount;
          const gridwidth = columnCount * cellwidth;
          const gridheight = rowCount * cellheight;

          const rowsArrayIds = [];

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
                cellText = "Time";
                break;
              case 4:
                cellText = "Score";
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
              let array_index = 0;
              if(rowsArrayIds[rowNumber] === undefined) {
                array_index = Math.floor(Math.random() * uids.length);
                rowsArrayIds[rowNumber] = array_index; 
              } else {
                array_index = rowsArrayIds[rowNumber];
              }

              let uid = uids[array_index];
              let image_id = "user_" + uid;
              let seconds, minutes = 0;

              switch (remainder) {
                case 0:
                  cellText =
                    document.scores[rowNumber - 1].ranks[
                      document.highScoreRegion
                    ];
                  break;
                case 1:
                 this.DEBUG &&
                    console.log("adding image from asset id " + image_id);
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
                    seconds = Math.floor(seconds - minutes * 60);
                    if (minutes < 10) {
                      cellText =
                        "0" +
                        minutes +
                        ":" +
                        (seconds < 10 ? "0" : "") +
                        seconds;
                    } else {
                      cellText =
                        minutes + ":" + (seconds > 10 ? "0" : "") + seconds;
                    }
                  } else {
                    cellText = seconds;
                  }
                  break;
                case 4:
                  cellText = document.scores[rowNumber - 1].score;
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
          };

          var onCellVisible = function (cell) {
            cell.setContainer(newCellObject(this, cell));
            //console.log('Cell ' + cellIdx + ' visible');
          };

          this.table = this.add.rexGridTable(
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
          this.scoreBuildingInProgress = false;
        });
        loader.start();
      }
    }
  }

  create() {
    super.create(roundAmount);

    this.scoreBuildingInProgress = false;
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
      .text(this.getCenterX(), 250 * uiScale, "", {
        fontSize: 45 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0.5);
  }

  changeScoreText() {
    let highScoreRegion = document.highScoreRegion;
    let specificRegion = false;
    if (
      document.highScoreRegion === "city" &&
      document.scores.length > 0 &&
      document.scores[0].location_city_name !== undefined
    ) {
      highScoreRegion = document.scores[0].location_city_name;
      specificRegion = true;
    }
    if (
      document.highScoreRegion === "country" &&
      document.scores.length > 0 &&
      document.scores[0].location_country_name !== undefined
    ) {
      highScoreRegion = document.scores[0].location_country_name;
      specificRegion = true;
    }
    if (
      document.highScoreRegion === "region" &&
      document.scores.length > 0 &&
      document.scores[0].location_region_name !== undefined
    ) {
      highScoreRegion = document.scores[0].location_region_name;
      specificRegion = true;
    }
    this.scoreText.setText("HighScores");
    if (
      document.highScoreRegion === "world" ||
      document.highScoreRegion === "friends"
    ) {
      this.regionText.setText(
        highScoreRegion +
          "\n" +
          document.highScorePlayers +
          " Player" +
          (document.highScorePlayers > 1 ? "s" : "") +
          "\n" +
          document.highScoreRounds +
          " Rounds"
      );
    } else {
      if (specificRegion) {
        this.regionText.setText(
          document.highScoreRegion +
            ": " +
            highScoreRegion +
            "\n" +
            document.highScorePlayers +
            " Player" +
            (document.highScorePlayers > 1 ? "s" : "") +
            "\n" +
            document.highScoreRounds +
            " Rounds"
        );
      } else {
        this.regionText.setText(
          "Ladder: " +
            document.highScoreRegion +
            "\n" +
            document.highScorePlayers +
            " Player" +
            (document.highScorePlayers > 1 ? "s" : "") +
            "\n" +
            document.highScoreRounds +
            " Rounds"
        );
      }
    }
  }
}
