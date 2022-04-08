import FindItScene from "./FindItScene.js";
export default class BackGroundAndUIScene extends FindItScene {
  constructor() {
    super("backgroundanduiscene");
    this.showRoundAmount = false;
  }
  preload() {
    super.preload();
  }

  init() {
    const a = 3840 / document.game.canvas.width;
    const b = 2160 / document.game.canvas.height;
    const scale = 1 / (a < b ? a : b);
    DEBUG && console.log("scale:" + scale);
    this.bg = this.add.image(0, 0, "bg").setScale(scale).setOrigin(0, 0);
  }

  create() {
    super.create();
    // listen for playerConnection events triggered by the AirConsole
    this.events.on("playerConnectionEvent", this.handlePlayerCount, this);
    // listen for sceneChange by AirConsole
    this.events.on("sceneChange", this.handleSceneChange, this);

    this.graphics = this.add.graphics();
    // draw the ui area for the player amount
    this.graphics.fillStyle(0x2962ff, 1);
    this.graphics.fillRoundedRect(32, 32, 150, 40, 20);
    this.graphics.lineStyle(4, 0x002171, 1);
    this.graphics.strokeRoundedRect(32, 32, 150, 40, 20);
    // draw the ui area for the sound elements
    this.graphics.fillRoundedRect(
      document.game.canvas.width - 152,
      32,
      120,
      40,
      20
    );
    this.graphics.lineStyle(4, 0x002171, 1);
    this.graphics.strokeRoundedRect(
      document.game.canvas.width - 152,
      32,
      120,
      40,
      20
    );
    // place the music icon
    if (document.musicOff === true) {
      // strike through the music icon if music is off
      this.music = this.add
        .image(document.game.canvas.width - 140, 35, "music-slash")
        .setOrigin(0, 0);
    } else {
      this.music = this.add
        .image(document.game.canvas.width - 135, 35, "music")
        .setScale(0.9)
        .setOrigin(0, 0);
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
    this.scene.launch("mainmenu");
  }

  handlePlayerCount() {
    this.playerAmount.setText(document.connectedPlayersAmount);
  }

  handleSceneChange(scene) {
    if (scene === "mainmenu") {
        this.roundAmountGraphics.destroy();
        this.hashtag.destroy();
        this.round.destroy();
    } else if (this.roundAmountGraphics === undefined || this.roundAmountGraphics.scene === undefined) {
      // draw the ui area for the round amount
      this.roundAmountGraphics = this.add.graphics();
      this.roundAmountGraphics.fillRoundedRect(32, 92, 150, 40, 20);
      this.roundAmountGraphics.lineStyle(4, 0x002171, 1);
      this.roundAmountGraphics.strokeRoundedRect(32, 92, 150, 40, 20);
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

    DEBUG && console.log("handleSceneChange was invoked with:");
    DEBUG && console.log(scene);
    // stop the second scene that is running above us
    this.scene.stop(document.game.scene.getScenes(true)[1]);
    this.scene.launch(scene);
  }
}
