import { objects } from "../objects.js";
import FindItScene from "./FindItScene.js";
/*
<div style="
    position: absolute;
    font-family: 'Luckiest Guy';
    color: white;
    font-size: 30px;
    border: 8px solid #2962ff;
    margin: 10px;
    padding: 10px;
    padding-top: 0px;
    padding-left: 58px;
    border-radius: 20px;
    line-height: 30px;
    height: 20px;
"><div style="
    display: inline;
    position: absolute;
    font-size: 88px;
    position: absolute;
    left: 0px;
    top: 0px;
    left: -8px;
    color: #002171;
">#</div>10/20</div>
*/

export default class Guessing extends FindItScene {
  constructor() {
    super("guessing");
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    /* white line that helps see bounds 
    this.graphics.lineStyle(4, 0xffffff, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(0, document.body.offsetHeight);
    this.graphics.lineTo(document.body.offsetWidth / 2, document.body.offsetHeight / 2);
    this.graphics.lineTo(0, 0); 

    this.graphics.strokePath(); */

    DEBUG && console.log("canvas: ") + this.canvas;

    var gridConfig = {
      scene: this,
      cols: 4,
      rows: 2,
      graphics: this.graphics,
      canvas: document.game.canvas,
    };
    this.aGrid = new AlignGrid(gridConfig);
    // this.aGrid.showNumbers(1, document.game.canvas.width, document.game.canvas.height);

    this.assets = [];
    this.effects = [];

    var i = 0;
    var col, row;
    for (col = 0; col < 4; col++) {
      for (row = 0; row < 2; row++) {
        this.assets[i] = this.add.image(
          0,
          0,
          "asset" + document.set[0].icons[i]
        );
        this.assets[i].id = document.set[0].icons[i];
        this.aGrid.placeAt(
          col,
          row,
          this.assets[i],
          document.game.canvas.height
        );
        this.assets[i].displayWidth =
          (document.body.offsetWidth / 4) * 0.6 * document.uiScale;
        this.assets[i].basedisplayWidth = this.assets[i].displayWidth;
        // assign random direction
        this.assets[i].direction = Math.random() > 0.5 ? "up" : "down";

        // get a random number between 60 and 100
        var randomNumber = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
        randomNumber = randomNumber / 100;
        DEBUG && console.log("random: " + randomNumber);

        this.assets[i].displayWidth *= randomNumber;

        this.assets[i].scaleY = this.assets[i].scaleX;

        this.postFxPlugin.add(this.assets[i], {
          distance: 5,
          outerStrength: 1,
          innerStrength: 1,
          glowColor: 0xffffff,
          quality: 1,
        });

        // rotate the image by a random amount
        this.assets[i].rotation += Math.random() * 360;

        i++;
      }
    }
  }

  update() {
    super.update();
    // stop animating during the tween
    if (!document.tweenComplete) {
      if (!document.rotationOff) {
        this.rotateAssets();
      }
      if (!document.scalingOff) {
        this.scaleAssets();
      }
    }
    if (document.aftertweenComplete) {
      // set tween to false
      document.aftertweenComplete = false;
      document.tweenComplete = false;
      if (document.lastRound) {
        sceneChange("endofgame");
      } else {
        sceneChange("timescreen");
      }
    }
    // check if an icon is correct
    if (document.correct_icon_id !== -1) {
      if (!document.sfxOff) {
        this.success.play();
      }
      // loop all assets in foreach
      this.assets.forEach(
        function (asset) {
          if (asset.id === document.correct_icon_id) {
            DEBUG && console.log(asset);
            this.tweens.add({
              targets: asset,
              duration: 1800,
              rotation: 0,
              scaleX: 2.5 * document.uiScale,
              scaleY: 2.5 * document.uiScale,
              x: this.getCenterX(),
              y: this.getCenterY(),
              delay: Math.random() * 2,
              ease: "Sine.easeInOut",
              onComplete: () => {
                document.tweenComplete = true;
                setTimeout(() => {
                  document.aftertweenComplete = true;
                }, 1250);
              },
            });
          } else {
            // move the other assets off the screen in right direction
            this.tweens.add({
              targets: asset,
              duration: 1500,
              x: document.game.canvas.width + asset.x + asset.displayWidth,
              ease: "Sine.easeInOut",
            });
          }
        }.bind(this)
      );
      document.correct_icon_id = -1;
    }
  }
}

class AlignGrid {
  constructor(config) {
    if (!config.scene) {
      console.log("missing scene!");
      return;
    }
    if (!config.rows) {
      config.rows = 3;
    }
    if (!config.cols) {
      config.cols = 3;
    }
    if (!config.width) {
      config.width = config.canvas.width;
    }
    if (!config.height) {
      config.height = config.canvas.height * 0.8;
    }
    this.h = config.height;
    this.w = config.width;
    this.rows = config.rows;
    this.cols = config.cols;
    this.scene = config.scene;
    this.graphics = config.graphics;
    //cw cell width is the scene width divided by the number of columns
    this.cw = this.w / this.cols;
    //ch cell height is the scene height divided the number of rows
    this.ch = this.h / this.rows;

    DEBUG && console.log("config: ");
    DEBUG && console.log(config);
  }
  //mostly for planning and debugging this will
  //create a visual representation of the grid
  showNumbers(a = 1, canvasWidth, canvasHeight) {
    this.graphics.lineStyle(4, 0xff0000, a);

    this.graphics.beginPath();
    for (var i = 0; i < this.w; i += this.cw) {
      this.graphics.moveTo(i, 0 + canvasHeight * 0.2);
      this.graphics.lineTo(i, this.h + canvasHeight * 0.2);
    }
    for (var i = 0; i < this.h; i += this.ch) {
      this.graphics.moveTo(0, i + canvasHeight * 0.2);
      this.graphics.lineTo(this.w, i + canvasHeight * 0.2);
    }

    this.graphics.strokePath();
  }

  //place an object in relation to the grid
  placeAt(xx, yy, obj, canvasHeight) {
    //calculate the center of the cell
    //by adding half of the height and width
    //to the x and y of the coordinates
    var x2 = this.cw * xx + this.cw / 2;
    var y2 = this.ch * yy + this.ch / 2 + canvasHeight * 0.2;
    obj.x = x2;
    obj.y = y2;
  }
}
