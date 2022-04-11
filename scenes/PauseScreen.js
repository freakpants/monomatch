import FindItScene from "./FindItScene.js";
export default class PauseScreen extends FindItScene {
  constructor() {
    super("pausescreen");
    this.staticText = "The game is paused.";
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    const uiScale = document.uiScale;
    console.log("initiating pause screen");
    this.add.image(this.getCenterX(), 300 * uiScale, "logo");
    this.text = this.add
      .text(this.getCenterX(), this.getCenterY() + 200 * uiScale , this.staticText, {
        fontSize: 45 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0.5);
  }
}
