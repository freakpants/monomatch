
export default class PauseScreen extends Phaser.Scene {
    constructor() {
        super('pausescreen');
        this.staticText = 'The game is paused.\nPress start to resume.';
    }

    preload() {
        this.load.svg('logo', 'assets/find_it_logo.svg');
    }

    create() {

        

        console.log("initiating pause screen");
        window.addEventListener('resize', this.resize);
        this.resize();

        var graphics = this.add.graphics();

        graphics.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x002171, 0x002171);
        graphics.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

        this.text = this.add.text(this.getCenterX(), this.getCenterY() + 200, this.staticText, { fontSize: "30px", align: "center", color: '#ffffff', fontFamily: 'Oswald' }).setOrigin(0.5, 0.5);
          
        this.assets = [];
        this.add.image(this.getCenterX(), 300, "logo");

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
