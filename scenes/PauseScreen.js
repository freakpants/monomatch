import FindItScene from './FindItScene.js';
export default class PauseScreen extends FindItScene {
    constructor() {
        super('pausescreen');
        this.staticText = 'The game is paused.';
    }

    preload() {
        this.load.svg('logo', 'assets/find_it_logo.svg');
        this.load.svg('bg', 'assets/drawing-4.svg');
    }

    create() {

        super.create();
        

        console.log("initiating pause screen");
        window.addEventListener('resize', this.resize);
        this.resize();

        var graphics = this.add.graphics();


           
        this.assets = [];

        this.add.image(0, 0, "bg").setScale(0.39).setOrigin(0,0);

        this.add.image(this.getCenterX(), 300, "logo");

        this.text = this.add.text(this.getCenterX(), this.getCenterY() + 200, this.staticText, { fontSize: "45px", align: "center", color: '#ffffff', fontFamily: 'Luckiest Guy' }).setOrigin(0.5, 0.5);
       

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
