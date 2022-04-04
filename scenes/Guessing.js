import { objects } from '../objects.js';
import FindItScene from './FindItScene.js';

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
        super('guessing');
    }

    preload() {
        objects.forEach((object) => {
            this.load.image("asset" + object.id, "assets/asset" + object.id + ".png");
        });
        this.load.svg('logo', 'assets/find_it_logo.svg');
        this.load.svg('bg', 'assets/drawing-4.svg');
 this.load.plugin('rexglowfilter2pipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilter2pipelineplugin.min.js', true);
    }

    create() {
        var postFxPlugin = this.plugins.get('rexglowfilter2pipelineplugin');
        window.addEventListener('resize', this.resize);
        this.resize();
        var graphics = this.add.graphics();

        
        graphics.fillStyle(0x2962ff, 1);
        graphics.fillRoundedRect(32, 32, 150, 40, 20);
        graphics.fillRoundedRect(32, 92, 150, 40, 20);

        graphics.lineStyle(4, 0x002171, 1);
        graphics.strokeRoundedRect(32, 32, 150, 40, 20);
        graphics.strokeRoundedRect(32, 92, 150, 40, 20);

        var gridConfig = {
            'scene': this,
            'cols': 4,
            'rows': 2,
            'graphics': graphics
        }
        this.aGrid = new AlignGrid(gridConfig);
        //this.aGrid.showNumbers();

        this.assets = [];
        this.effects = [];

        

        var bg = this.add.image(0, 0, "bg").setScale(0.39).setOrigin(0,0);

        
        var players = this.add.text(20, 20, "👥" , { fontSize: "45px", align: "center", color: '#002171', fontFamily: 'Luckiest Guy' });
        var hashtag = this.add.text(20, 60, "#" , { fontSize: "90px", align: "center", color: '#002171', fontFamily: 'Luckiest Guy' });
        

        postFxPlugin.add(hashtag, {
            distance: 5,
            outerStrength: 1,
            innerStrength: 1,
            glowColor: 0xffffff,
            quality: 1
        });

        postFxPlugin.add(players, {
            distance: 5,
            outerStrength: 1,
            innerStrength: 1,
            glowColor: 0xffffff,
            quality: 1
        });

        var round = this.add.text(90, 95, document.round + "/" + document.maxRound, { fontSize: "30px", align: "center", color: 'white', fontFamily: 'Luckiest Guy' });
        var playerAmount = this.add.text(112, 35, document.connectedPlayersAmount, { fontSize: "30px", align: "center", color: 'white', fontFamily: 'Luckiest Guy' });
        


        const layer = this.add.layer();

        layer.add([ bg, graphics, hashtag, players, round, playerAmount ]);

   
        

        
        

        

        // this.add.image(100, this.sys.canvas.height - 100, "logo").setScale(0.4);
        

        // this.text = this.add.text(this.sys.canvas.width - 110, this.sys.canvas.height - 20, "Round " +  + " of " +  , { fontSize: "30px", align: "center", color: '#ffffff', fontFamily: 'Luckiest Guy' }).setOrigin(0.5, 0.5);
        

        

        var i = 0;
        var col, row;
        for (col = 0; col < 4; col++) {
            for (row = 0; row < 2; row++) {
                this.assets[i] = this.add.image(0, 0, "asset" + document.set[0].icons[i]);
                // this.assets[i] = this.add.image(0, 0, "asset" + 0);
                this.aGrid.placeAt(col, row, this.assets[i]);
                this.assets[i].displayWidth = (document.body.offsetWidth / 4) * 0.6;

                // get a random number between 60 and 100
                var randomNumber = Math.floor(Math.random() * (100 - 60 + 1)) + 60;    
                randomNumber = randomNumber / 100;
                DEBUG && console.log("random: " + randomNumber);
                this.assets[i].displayWidth = this.assets[i].displayWidth * randomNumber;
  
                this.assets[i].scaleY = this.assets[i].scaleX;

                // this.assets[i].setPostPipeline(GlowFilterPostFx);

               
                postFxPlugin.add(this.assets[i], {
                    distance: 5,
                    outerStrength: 1,
                    innerStrength: 1,
                    glowColor: 0xffffff,
                    quality: 1
                });
    
 

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

    getCenterX()
    {
       return ( this.sys.canvas.width  ) * .5
    }

    getCenterY()
    {
       return ( this.sys.canvas.height  ) * .5
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
            config.height = document.body.offsetHeight * 0.8;
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
        var y2 = (this.ch * yy + this.ch / 2) + document.body.offsetHeight * 0.2;
        obj.x = x2;
        obj.y = y2;
    }
}