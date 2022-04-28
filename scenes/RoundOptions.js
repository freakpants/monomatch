import FindItScene from "./FindItScene.js";
export default class RoundOptions extends FindItScene {
  constructor() {
    super("roundoptionsscene");
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    const uiScale = document.uiScale;
    console.log("initiating round options");

    this.drawChevrons();

    this.text = this.add
      .text(this.getCenterX(), 32 * uiScale, "How Many Rounds?", {
        fontSize: 75 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0);
    this.roundAmountOption = this.add
      .text(this.getCenterX(), this.getCenterY(), document.maxRound, {
        fontSize: 150 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0.5);
      /* this.postFxPlugin.add(this.roundAmountOption, {
        distance: 5,
        outerStrength: 1,
        innerStrength: 1,
        glowColor: 0xffffff,
        quality: 1,
      }); */
  }
  update(){
    this.roundAmountOption.setText(document.maxRound);
  }
}
