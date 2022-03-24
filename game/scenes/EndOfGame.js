
export default class EndOfGame extends Phaser.Scene {
    constructor() {
        super('endofgame');
    }

    preload() {
        const url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridtableplugin.min.js';
        this.load.plugin('rexgridtableplugin', url, true);
    }

    create() {
        var graphics = this.add.graphics();

        var newCellObject = function (scene, cell) {
            var bg = scene.add.graphics(0, 0)
              .fillStyle(0x555555)
              .fillRect(2, 2, 58, 58);
            var txt = scene.add.text(5, 5, "keks");
            var container = scene.add.container(0, 0, [bg, txt]);
            return container;
          }
      
          var onCellVisible = function (cell) {
            cell.setContainer(newCellObject(this, cell));
            //console.log('Cell ' + cellIdx + ' visible');
          };

          const cellwidth  = 60;
          const cellheight = 60;
          const columnCount = 4;
          const rowCount = 9;

          const cellsCount = columnCount * rowCount;
          const gridwidth = columnCount * cellwidth;
          const gridheight = rowCount * cellheight;

          var table = this.add.rexGridTable(this.getCenterX(), this.getCenterY(), gridwidth , gridheight, {
            cellHeight: cellwidth,
            cellWidth: cellwidth,
            cellsCount: cellsCount,
            columns: columnCount,
            cellVisibleCallback: onCellVisible.bind(this),
          });

        console.log("initiating end of game screen");
        window.addEventListener('resize', this.resize);
        this.resize();
        

        graphics.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x002171, 0x002171);
        graphics.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

        this.add.text(this.getCenterX(), 100, 'The Game has ended!\n', { fontSize: "30px", align: "center", color: '#ffffff', fontFamily: 'Arial' }).setOrigin(0.5, 0.5);
    }

    getCenterX()
    {
       return ( this.sys.canvas.width  ) * .5
    }

    getCenterY()
    {
       return ( this.sys.canvas.height  ) * .5
    }



    resize() {
        var canvas = this.game.canvas;
        canvas.style.width = document.body.offsetWidth + 'px';
        canvas.style.height = document.body.offsetHeight + 'px';
    }
}
