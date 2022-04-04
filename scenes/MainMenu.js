
export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('mainmenu');
        this.staticText = 'Welcome to Find It Faster!\nPress start to play a round with the connected players!\nThis game requires 2-8 players to start.\n';
    }

    preload() {
        this.load.svg('logo', 'assets/find_it_logo.svg');
        this.load.svg('bg', 'assets/drawing-4.svg');
    }

    create() {

        

        const timedEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop: true,
          });

        console.log("initiating main menu");
        window.addEventListener('resize', this.resize);
        this.resize();
        var graphics = this.add.graphics();

        this.add.image(this.getCenterX(), this.getCenterY(), "bg").setScale(0.39).setOrigin(0.5,0.5);

        // graphics.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x002171, 0x002171);
        graphics.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

        this.text = this.add.text(this.getCenterX(), this.getCenterY() + 200, this.staticText + 'Currently ' + document.connectedPlayersAmount + " are connected.", { fontSize: "30px", align: "center", color: '#ffffff', fontFamily: 'Luckiest Guy' }).setOrigin(0.5, 0.5);
          
        this.assets = [];

        // this.add.image(this.getCenterX(), 300, "logo").setScale(0.5);
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

    onEvent() {
        if(document.connectedPlayersAmount >= 2 && document.connectedPlayersAmount <= 8){
            this.text.setText(this.staticText + 'Currently ' + document.connectedPlayersAmount + " are connected.\nThe game can start.");
        } else {
            this.text.setText(this.staticText + 'Currently ' + document.connectedPlayersAmount + " are connected.\nThe game cannot start.");
        }
        
      }


    resize() {
        var canvas = this.game.canvas;
        canvas.style.width = document.body.offsetWidth + 'px';
        canvas.style.height = document.body.offsetHeight + 'px';
    }
}
