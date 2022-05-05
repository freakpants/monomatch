import FindItScene from "./FindItScene.js";
export default class Credits extends FindItScene {
  constructor() {
    super("credits");
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    const uiScale = document.uiScale;
    console.log("initiating credits");

    this.text = this.add
      .text(this.getCenterX(), 32 * uiScale, "Credits", {
        fontSize: 75 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0);
    this.creditsText = this.add
      .text(this.getCenterX(), this.getCenterY(), "Developed by: Christian Nyffenegger/freakpants (https://twitter.com/freakpants)\nSound effects by: https://www.zapsplat.com", {
        fontSize: 35 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0);
    this.creditsText.setLineSpacing(25 * uiScale);
  }
}
