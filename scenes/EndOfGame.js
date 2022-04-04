import FindItScene from './FindItScene.js';
export default class EndOfGame extends FindItScene {
  constructor() {
    super("endofgame");
  }

  preload() {
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

  create() {
    const cellwidth = 200;
    const cellheight = 64;
    const columnCount = 4;
    const rowCount = document.playerScores.length + 1;

    const cellsCount = columnCount * rowCount;
    const gridwidth = columnCount * cellwidth;
    const gridheight = rowCount * cellheight;

    var graphics = this.add.graphics();

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
      const rowNumber = (firstCellofRow / columnCount);
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
      var bg = scene.add
        .graphics(0, 0)
        .fillStyle(bgColor)
        .fillRect(0, 0, 200, 64);

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
      if(rowNumber > 0){
        switch(remainder){
            case 0:
              cellText = document.playerScores[rowNumber-1].position;
            break;
            case 1:
                var image_id = document.profile_pictures[document.playerScores[rowNumber-1].player];
                DEBUG && console.log("adding image from asset id " +  image_id);
                image = scene.add.image(100,32,  image_id );
            break;
            case 2:
                cellText = air_console.getNickname(document.playerScores[rowNumber-1].player);
                document.wideCells.push(cell.index); 
            break;
            case 3:
                cellText = document.playerScores[rowNumber-1].correct;
            break;
        }
      }
      
      var container;
      DEBUG && console.log()
      if(image !== null){
        DEBUG && console.log("we should be adding the image");
        container = scene.add.container(0, 0, [bg, image]);
      } else {
        var txt = scene.add.text(100, 32, cellText,{fontSize: "35px", fontFamily: "Luckiest Guy"}).setOrigin(0.5, 0.5);;
        container = scene.add.container(0, 0, [bg, txt]);
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

    console.log("initiating end of game screen");
    window.addEventListener("resize", this.resize);
    this.resize();

    graphics.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x002171, 0x002171);
    graphics.fillRect(
      0,
      0,
      document.body.offsetWidth,
      document.body.offsetHeight
    );

    this.add
      .text(this.getCenterX(), 100, "The Game has ended!\n", {
        fontSize: "45px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0.5);
  }

  getCenterX() {
    return this.sys.canvas.width * 0.5;
  }

  getCenterY() {
    return this.sys.canvas.height * 0.5;
  }

  resize() {
    var canvas = this.game.canvas;
    canvas.style.width = document.body.offsetWidth + "px";
    canvas.style.height = document.body.offsetHeight + "px";
  }
}
