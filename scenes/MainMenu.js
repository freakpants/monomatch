import FindItScene from "./FindItScene.js";
export default class MainMenu extends FindItScene {
  constructor() {
    super("mainmenu");
    this.staticText =
      "Welcome to Find It Faster!\nPress start to play a round with the connected players!\nThis game can be played with up to 8 players.\n";
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    const uiScale = document.uiScale;
    console.log("initiating main menu");

    this.text = this.add
      .text(
        this.getCenterX(),
        this.getCenterY() + 200 * uiScale,
        this.staticText,
        {
          fontSize: 30 * uiScale + "px",
          align: "center",
          color: "#ffffff",
          fontFamily: "Luckiest Guy",
        }
      )
      .setOrigin(0.5, 0.5);

    this.assets = [];

    // this.add.image(this.getCenterX(), 300, "logo").setScale(0.5);
    this.add.image(this.getCenterX(), 300 * uiScale, "logo").setScale(0.75 * uiScale);
  }

}
