import FindItScene from "./FindItScene.js";
export default class MusicOptions extends FindItScene {
  constructor() {
    super("musicoptionsscene");
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    const uiScale = document.uiScale;
    console.log("initiating music options");

    this.text = this.add
      .text(this.getCenterX(), 32 * uiScale, "Sound Options", {
        fontSize: 75 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0);

    this.graphics = this.add.graphics();

    /* this.graphics.lineStyle(4, 0xff0000);
    this.graphics.beginPath();
    this.graphics.moveTo( 0, this.getCenterY());

    this.graphics.lineTo(document.game.canvas.width, this.getCenterY());

    this.graphics.strokePath(); */

    // place the music icon
    this.musicText = this.add.text(
      this.getCenterX() - (315 * uiScale / 2) - 100 * uiScale,
      this.getCenterY() + (372 * uiScale / 2) + 100 * uiScale,
      "",
      {
        fontSize: 60 * uiScale + "px",
        align: "center",
        color: "white",
        fontFamily: "Luckiest Guy",
      }
    ).setOrigin(0.5, 0.5);


    this.drawChevrons();

    if (document.musicOff === true) {
      this.musicText.setText("Music: OFF");
      if(typeof this.music !== "undefined") {
        this.music.destroy();
      }
      // strike through the music icon if music is off
      this.music = this.add
        .image(
          this.getCenterX() - 100 * uiScale,
          this.getCenterY(),
          "music-slash-big"
        )
        .setOrigin(1, 0.5)
        .setScale(uiScale);
    } else {
      this.musicText.setText("Music: ON");
      this.music = this.add
        .image(
          this.getCenterX() - 100 * uiScale,
          this.getCenterY(),
          "music-big"
        )
        .setOrigin(1, 0.5)
        .setScale(uiScale);
    }
    // place the sfx icon
    this.sfxText = this.add.text(
      this.getCenterX() + (315 * uiScale / 2) + 100 * uiScale,
      this.getCenterY() + (372 * uiScale / 2) + 100 * uiScale,
      "",
      {
        fontSize: 60 * uiScale + "px",
        align: "center",
        color: "white",
        fontFamily: "Luckiest Guy",
      }
    ).setOrigin(0.5, 0.5);
    if (document.sfxOff === true) {
      this.sfxText.setText("SFX: OFF");
      if(typeof this.sfx !== "undefined") {
        this.sfx.destroy();
      }
      this.sfx = this.add
        .image(
          this.getCenterX() + 100 * uiScale,
          this.getCenterY(),
          "sfx-cross-big"
        )
        .setOrigin(0, 0.5)
        .setScale(uiScale);
    } else {
      this.sfxText.setText("SFX: ON");
      this.sfx = this.add
        .image(
          this.getCenterX() + 100 * uiScale,
          this.getCenterY(),
          "sfx-big"
        )
        .setOrigin(0, 0.5)
        .setScale(uiScale);
    }
  }
}
