
import FindItScene from './FindItScene.js';
export default class MainMenu extends FindItScene {
    constructor() {
        super('mainmenu');
        this.staticText = 'Welcome to Find It Faster!\nPress start to play a round with the connected players!\nThis game requires 2-8 players to start.\n';
    }

    preload() {
        super.preload();
        this.load.svg('logo', 'assets/find_it_logo.svg');
    }

    create() {
        var roundAmount = false;
        super.create(roundAmount);
        
        const timedEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop: true,
          });

        console.log("initiating main menu");

        this.text = this.add.text(this.getCenterX(), this.getCenterY() + 200, this.staticText + 'Currently ' + document.connectedPlayersAmount + " are connected.", { fontSize: "30px", align: "center", color: '#ffffff', fontFamily: 'Luckiest Guy' }).setOrigin(0.5, 0.5);
          
        this.assets = [];

        // this.add.image(this.getCenterX(), 300, "logo").setScale(0.5);
        this.add.image(this.getCenterX(), 300, "logo");

    }

    onEvent() {
        this.playerAmount.setText(document.connectedPlayersAmount);
        if(document.connectedPlayersAmount >= 2 && document.connectedPlayersAmount <= 8){
            this.text.setText(this.staticText + "The game can start.");
        } else {
            this.text.setText(this.staticText + "The game cannot start.");
        }
        
      }
}
