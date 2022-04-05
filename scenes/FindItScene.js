export default class FindItScene extends Phaser.Scene {
  preload() {
    this.load.svg('logo', 'assets/find_it_logo.svg');
    this.load.svg("bg", "assets/drawing-4.svg");
    this.load.plugin(
      "rexglowfilter2pipelineplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilter2pipelineplugin.min.js",
      true
    );
  }

  create(roundAmount = true) {
    // listen for playerConnection events triggered by the AirConsole
    this.events.on('playerConnectionEvent', this.handlePlayerCount, this);
    this.postFxPlugin = this.plugins.get("rexglowfilter2pipelineplugin");
    // determine the lower of two numbers
    const a = 3840 / document.game.canvas.width;
    const b = 2160 / document.game.canvas.height;
    const scale = 1 / (a < b ? a : b);
    DEBUG && console.log("scale:" + scale);
    this.bg = this.add.image(0, 0, "bg").setScale(scale).setOrigin(0, 0);
    this.graphics = this.add.graphics();
    // draw the ui area for the player amount
    this.graphics.fillStyle(0x2962ff, 1);
    this.graphics.fillRoundedRect(32, 32, 150, 40, 20);
    this.graphics.lineStyle(4, 0x002171, 1);
    this.graphics.strokeRoundedRect(32, 32, 150, 40, 20);
    if(roundAmount){
      // draw the ui area for the round amount
      this.graphics.fillRoundedRect(32, 92, 150, 40, 20);
      this.graphics.lineStyle(4, 0x002171, 1);
      this.graphics.strokeRoundedRect(32, 92, 150, 40, 20);
      // place the hashtag icon
      this.hashtag = this.add.text(20, 60, "#", {
        fontSize: "90px",
        align: "center",
        color: "#002171",
        fontFamily: "Luckiest Guy",
      });
      // place glow on hashtag icon
      this.postFxPlugin.add(this.hashtag, {
        distance: 5,
        outerStrength: 1,
        innerStrength: 1,
        glowColor: 0xffffff,
        quality: 1,
      });
      // place the round Amount text
      this.round = this.add.text(
        90,
        95,
        document.round + "/" + document.maxRound,
        {
          fontSize: "30px",
          align: "center",
          color: "white",
          fontFamily: "Luckiest Guy",
        }
      );
  
    }
    this.players = this.add.text(20, 20, "👥", {
      fontSize: "45px",
      align: "center",
      color: "#002171",
      fontFamily: "Luckiest Guy",
    });
    this.postFxPlugin.add(this.players, {
        distance: 5,
        outerStrength: 1,
        innerStrength: 1,
        glowColor: 0xffffff,
        quality: 1,
      });
    this.playerAmount = this.add.text(
      112,
      35,
      document.connectedPlayersAmount,
      {
        fontSize: "30px",
        align: "center",
        color: "white",
        fontFamily: "Luckiest Guy",
      }
    );
  }

  getCenterX() {
    return this.sys.canvas.width * 0.5;
  }

  getCenterY() {
    return this.sys.canvas.height * 0.5;
  }

  handlePlayerCount() {
    this.playerAmount.setText(document.connectedPlayersAmount);
  }
}
