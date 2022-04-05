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
    console.log("initiating pause screen");
    this.add.image(this.getCenterX(), 300, "logo");
    this.text = this.add
      .text(this.getCenterX(), this.getCenterY() + 200, this.staticText, {
        fontSize: "45px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0.5);
  }
}
