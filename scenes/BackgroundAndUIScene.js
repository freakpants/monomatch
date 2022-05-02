import FindItScene from "./FindItScene.js";
import eventsCenter from "../EventsCenter.js";
export default class BackGroundAndUIScene extends FindItScene {
  constructor() {
    super("backgroundanduiscene");
    this.showRoundAmount = false;
  }
  preload() {
    super.preload();
  }

  init(data) {
    this.origin = data.origin;
    this.mainmenuactive = data.mainmenuactive;
    const a = 3840 / document.game.canvas.width;
    const b = 2160 / document.game.canvas.height;
    const scale = 1 / (a < b ? a : b);
    DEBUG && console.log("scale:" + scale);
  }

  update() {
    super.update();
    // this.graphics.clear();
    this.playerAmount.setText(document.connectedPlayersAmount);

    let widthChanged =  document.game.scale.gameSize._width !==
    document.game.scale.parentSize._width;
    let heightChanged = document.game.scale.gameSize._height !==
    document.game.scale.parentSize._height;

    // DEBUG && console.log("widthChanged: " + widthChanged);
    // DEBUG && console.log("heightChanged: " + heightChanged);

    if (!this.resizeHappening && (heightChanged || widthChanged)) {
      this.resizeHappening = true;
      this.time.delayedCall(1000, () => (this.resizeHappening = false));
      DEBUG && console.log("resize event from scene:" + this.scene.key);

      eventsCenter.emit("restartBackground");
      
      
      this.activeScenes = this.game.scene.getScenes(true);
      DEBUG && console.log("active scenes:");
      DEBUG && console.log(this.activeScenes);

      const bgScene = this.activeScenes[0];
      DEBUG && console.log("attempting to get background scene:");
      DEBUG && console.log(bgScene);

      const secondScene = this.activeScenes[1];
      DEBUG && console.log("getting second scene:");
      DEBUG && console.log(secondScene);
     
      document.uiScale = Math.sqrt(
        (document.game.scale.parentSize._width *
          document.game.scale.parentSize._height) /
          (1920 * 1016)
      );
      document.game.scale.resize(
        document.game.scale.parentSize._width,
        document.game.scale.parentSize._height
      );

      
      this.restartActiveScene();

    }

    if(document.restartBackground){
      this.restartActiveScene();
    }

  }

  create() {
    super.create();
    // only add event listener if it doesnt exist already
    if (this.events._events.sceneChange === undefined) {
      // listen for sceneChange by AirConsole
      this.events.on("sceneChange", this.handleSceneChange, this);
    }
    if (this.events._events.optionChange === undefined) {
      // listen for optionsChange by AirConsole
      this.events.on("optionChange", this.handleOptionChange, this);
    }

    let scene = document.gameScene;
    this.mainmenuactive = (scene === "mainmenu" ||
    scene === "musicoptionsscene" ||
    scene === "roundoptionsscene" ||
    scene === "difficultyoptionsscene" ||
    scene === "credits" ||
    scene === "highscore");

    DEBUG && console.log("this.mainmenuactive evaluated scene:" + scene);
    DEBUG && console.log("this.mainmenuactive:" + this.mainmenuactive);
  
    // listen for background restart
    eventsCenter.once('restartBackground', this.handleRestart, this);


    const uiScale = document.uiScale;

    this.graphics = this.add.graphics();
    // draw the ui area for the player amount
    this.graphics.fillStyle(0x2962ff, 1);
    this.graphics.fillRoundedRect(
      32 * uiScale,
      32 * uiScale,
      150 * uiScale,
      40 * uiScale,
      20 * uiScale
    );
    this.graphics.lineStyle(4 * uiScale, 0x002171, 1);
    this.graphics.strokeRoundedRect(
      32 * uiScale,
      32 * uiScale,
      150 * uiScale,
      40 * uiScale,
      20 * uiScale
    );
    // draw the ui area for the sound elements
    this.graphics.fillRoundedRect(
      document.game.canvas.width - 152 * uiScale,
      32 * uiScale,
      120 * uiScale,
      40 * uiScale,
      20 * uiScale
    );
    this.graphics.lineStyle(4, 0x002171, 1);
    this.graphics.strokeRoundedRect(
      document.game.canvas.width - 152 * uiScale,
      32 * uiScale,
      120 * uiScale,
      40 * uiScale,
      20 * uiScale
    );
    // place the music icon
    this.drawMusicIcon();
    // place the sfx icon
    this.drawSFXIcon();

    this.players = this.add.text(20 * uiScale, 20 * uiScale, "👥", {
      fontSize: 45 * uiScale + "px",
      align: "center",
      color: "#002171",
      fontFamily: "Luckiest Guy",
    });
    /* this.postFxPlugin.add(this.players, {
      distance: 5,
      outerStrength: 1,
      innerStrength: 1,
      glowColor: 0xffffff,
      quality: 0.1,
    }); */
    this.playerAmount = this.add.text(
      112 * uiScale,
      35 * uiScale,
      document.connectedPlayersAmount,
      {
        fontSize: 30 * uiScale + "px",
        align: "center",
        color: "white",
        fontFamily: "Luckiest Guy",
      }
    );
    if (this.origin === "resize" && this.mainmenuactive === false) {
      DEBUG && console.log("drawing round amount because of resize");
      this.drawRoundAmountUi();
    }

    // if we are coming from the bootscene, initialize the mainmenu
    if (this.origin === "bootscene") {
      DEBUG && console.log("coming from bootscene, launching mainmenu");
      this.scene.launch("mainmenu");
    }
  }

  drawMusicIcon() {
    const uiScale = document.uiScale;
    if (typeof this.music !== "undefined") {
      this.music.destroy();
    }
    if (document.musicOff) {
      // strike through the music icon if music is off
      this.music = this.add
        .image(
          document.game.canvas.width - 135 * uiScale,
          35 * uiScale,
          "music-slash"
        )
        .setScale(0.9 * uiScale)
        .setOrigin(0, 0);
    } else {
      this.music = this.add
        .image(
          document.game.canvas.width - 135 * uiScale,
          35 * uiScale,
          "music"
        )
        .setScale(0.9 * uiScale)
        .setOrigin(0, 0);
    }
  }

  drawSFXIcon() {
    const uiScale = document.uiScale;
    if (typeof this.sfx !== "undefined") {
      this.sfx.destroy();
    }
    if (document.sfxOff) {
      this.sfx = this.add
        .image(
          document.game.canvas.width - 90 * uiScale,
          37 * uiScale,
          "sfx-cross"
        )
        .setScale(0.9 * uiScale)
        .setOrigin(0, 0);
    } else {
      this.sfx = this.add
        .image(document.game.canvas.width - 90 * uiScale, 37 * uiScale, "sfx")
        .setScale(0.9 * uiScale)
        .setOrigin(0, 0);
    }
  }

  drawRoundAmountUi() {
    DEBUG && console.log("drawRoundAmountUi was called");
    const uiScale = document.uiScale;

    // start over instead of overdrwaing
    if (typeof this.roundAmountGraphics !== "undefined") {
      this.roundAmountGraphics.destroy();
      this.hashtag.destroy();
      this.round.destroy();
    }

    // draw the ui area for the round amount
    this.roundAmountGraphics = this.add.graphics();
    this.roundAmountGraphics.fillRoundedRect(
      32 * uiScale,
      92 * uiScale,
      150 * uiScale,
      40 * uiScale,
      20 * uiScale
    );
    this.roundAmountGraphics.lineStyle(4 * uiScale, 0x002171, 1);
    this.roundAmountGraphics.strokeRoundedRect(
      32 * uiScale,
      92 * uiScale,
      150 * uiScale,
      40 * uiScale,
      20 * uiScale
    );
    // place the hashtag icon
    this.hashtag = this.add.text(20 * uiScale, 60 * uiScale, "#", {
      fontSize: 90 * uiScale + "px",
      align: "center",
      color: "#002171",
      fontFamily: "Luckiest Guy",
    });
    // place glow on hashtag icon
    /* this.postFxPlugin.add(this.hashtag, {
      distance: 5,
      outerStrength: 1,
      innerStrength: 1,
      glowColor: 0xffffff,
      quality: 0.1,
    }); */
    // place the round Amount text
    this.round = this.add.text(
      90 * uiScale,
      95 * uiScale,
      document.round + "/" + document.maxRound,
      {
        fontSize: 30 * uiScale + "px",
        align: "center",
        color: "white",
        fontFamily: "Luckiest Guy",
      }
    );
  }

  handleOptionChange(option) {
    DEBUG && console.log("handleOptionChange was called");
    switch (option) {
      case "music":
        this.drawMusicIcon();
        break;
      case "sfx":
        this.drawSFXIcon();
        break;
      case "round":
        this.drawRoundAmountUi();
        break;
    }
  }

  handleSceneChange(scene) {
    DEBUG && console.log("handleSceneChange was called");
    if (
      scene === "mainmenu" ||
      scene === "musicoptionsscene" ||
      scene === "roundoptionsscene" ||
      scene === "difficultyoptionsscene" ||
      scene === "credits" ||
      scene === "highscore"
    ) {
      if (typeof this.roundAmountGraphics !== "undefined") {
        this.roundAmountGraphics.destroy();
        this.hashtag.destroy();
        this.round.destroy();
      }
    } else if (this.roundAmountGraphics === undefined || this.roundAmountGraphics.scene === undefined) {
      DEBUG && console.log("drawing round amount ui");
      this.drawRoundAmountUi();
    }

    DEBUG && console.log("handleSceneChange was invoked with:");
    DEBUG && console.log(scene);
    // stop the main scene
    DEBUG && console.log("document.gameScene:");
    DEBUG && console.log(document.gameScene);
    eventsCenter.emit("stopScene", document.gameScene);

    // change the scene
    document.gameScene = scene;

    DEBUG && console.log("launching scene:");
    DEBUG && console.log(scene);
    this.scene.launch(scene);
  }

  handleRestart(params){
    DEBUG && console.log("handleRestart was called");
    // this.scene.stop();
    // DEBUG && console.log("this still happens");
    // this.scene.launch("backgroundanduiscene", {origin: "resize"});
    this.scene.stop();
    document.startBackground = true;
  }
}
