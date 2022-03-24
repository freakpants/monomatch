export default class EndOfGame extends Phaser.Scene {
  constructor() {
    super("endofgame");
  }

  preload() {
    const url =
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridtableplugin.min.js";
    this.load.plugin("rexgridtableplugin", url, true);
  }

  create() {
    const cellwidth = 60;
    const cellheight = 60;
    const columnCount = 4;
    const rowCount = 9;

    const cellsCount = columnCount * rowCount;
    const gridwidth = columnCount * cellwidth;
    const gridheight = rowCount * cellheight;

    var graphics = this.add.graphics();

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
        .fillRect(2, 2, 58, 58);

      switch (cell.index) {
        case 0:
          cellText = "Position";
          break;
        case 1:
          cellText = "Avatar";
          break;
        case 2:
          cellText = "Nickname";
          break;
        case 3:
          cellText = "Points";
          break;
        default:
          cellText = cell.index;
          break;
      }
      var txt = scene.add.text(5, 5, cellText);
      var container = scene.add.container(0, 0, [bg, txt]);
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
        cellHeight: cellwidth,
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
        fontSize: "30px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Arial",
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
