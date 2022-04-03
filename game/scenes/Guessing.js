import { objects } from '/game/objects.js';
export default class Guessing extends Phaser.Scene {
    constructor() {
        super('guessing');
    }

    preload() {
        objects.forEach((object) => {
            this.load.image("asset" + object.id, "../game/assets/asset" + object.id + ".png");
        });

    }

    create() {
        window.addEventListener('resize', this.resize);
        this.resize();
        var graphics = this.add.graphics();

        graphics.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x002171, 0x002171);
        graphics.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

        var gridConfig = {
            'scene': this,
            'cols': 4,
            'rows': 2,
            'graphics': graphics
        }
        this.aGrid = new AlignGrid(gridConfig);
        // this.aGrid.showNumbers();

        this.assets = [];



        var i = 0;
        var col, row;
        for (col = 0; col < 4; col++) {
            for (row = 0; row < 2; row++) {
                this.assets[i] = this.add.image(0, 0, "asset" + document.set[0].icons[i]);
                // this.assets[i] = this.add.image(0, 0, "asset" + 0);
                this.aGrid.placeAt(col, row, this.assets[i]);
                this.assets[i].displayWidth = (document.body.offsetWidth / 4) * 0.6;

                // get a random number between 30 and 150
                var randomNumber = Math.floor(Math.random() * (150 - 30 + 1)) + 30;    
                randomNumber = randomNumber / 100;
                DEBUG && console.log("random: " + randomNumber);
                this.assets[i].displayWidth = this.assets[i].displayWidth * randomNumber;
  
                this.assets[i].scaleY = this.assets[i].scaleX;

                // rotate the image by a random amount
                this.assets[i].rotation += Math.random() * 360;

                i++;
            }
        }

    }

    resize() {
        var canvas = this.game.canvas;
        canvas.style.width = document.body.offsetWidth + 'px';
        canvas.style.height = document.body.offsetHeight + 'px';
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
            config.width = document.body.offsetWidth;
        }
        if (!config.height) {
            config.height = document.body.offsetHeight;
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
    }
    //mostly for planning and debugging this will
    //create a visual representation of the grid
    showNumbers(a = 1) {
        this.graphics.lineStyle(4, 0xff0000, a);

        this.graphics.beginPath();
        for (var i = 0; i < this.w; i += this.cw) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.h);
        }
        for (var i = 0; i < this.h; i += this.ch) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.w, i);
        }

        this.graphics.strokePath();
    }

    //place an object in relation to the grid
    placeAt(xx, yy, obj) {
        //calculate the center of the cell
        //by adding half of the height and width
        //to the x and y of the coordinates
        var x2 = this.cw * xx + this.cw / 2;
        var y2 = this.ch * yy + this.ch / 2;
        obj.x = x2;
        obj.y = y2;
    }
}