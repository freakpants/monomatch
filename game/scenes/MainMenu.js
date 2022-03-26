
export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('mainmenu');
    }

    preload() {
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

        graphics.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x002171, 0x002171);
        graphics.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

        this.text = this.add.text(this.getCenterX(), this.getCenterY(), 'Welcome to GameName!\nPress start to play a round with the connected players!\nThis game requires 2-8 players to start.\nCurrently ' + document.connectedPlayersAmount + " are connected.", { fontSize: "30px", align: "center", color: '#ffffff', fontFamily: 'Arial' }).setOrigin(0.5, 0.5);

        this.assets = [];

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
        this.text.setText('Welcome to GameName!\nPress start to play a round with the connected players!\nThis game requires 2-8 players to start.\nCurrently ' + document.connectedPlayersAmount + " are connected.", { fontSize: "30px", align: "center", color: '#ffffff', fontFamily: 'Arial' }).setOrigin(0.5, 0.5);
      }


    resize() {
        var canvas = this.game.canvas;
        canvas.style.width = document.body.offsetWidth + 'px';
        canvas.style.height = document.body.offsetHeight + 'px';
    }
}
