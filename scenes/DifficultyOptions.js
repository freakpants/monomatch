import FindItScene from "./FindItScene.js";
export default class DifficultyOptions extends FindItScene {
  constructor() {
    super("difficultyoptionsscene");
  }

  preload() {
    super.preload();
  }

  update(){
    super.update();
    this.scalingText.setText("Scaling:" + (document.scalingOff ? " OFF" : " ON"));
    this.rotationText.setText("Rotation:" + (document.rotationOff ? " OFF" : " ON"));
    if(!document.rotationOff){
      this.rotateAssets();
    }
    if(!document.scalingOff){
      this.scaleAssets();
    }
  }

  create() {
    super.create();
    const uiScale = document.uiScale;
    DEBUG && console.log("initiating difficulty options");

    this.text = this.add
      .text(this.getCenterX(), 32 * uiScale, "Difficulty", {
        fontSize: 75 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      })
      .setOrigin(0.5, 0);

    this.graphics = this.add.graphics();

    this.graphics.lineStyle(4, 0xff0000);
    this.graphics.beginPath();
    this.graphics.moveTo(this.getCenterX(), 0);

    this.graphics.lineTo(this.getCenterX(), document.game.canvas.height);

    this.graphics.strokePath();

    this.rotationText = this.add.text(
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


    this.rotation = this.add
    .image(
      this.getCenterX() - (315 * uiScale / 2) - 100 * uiScale,
      this.getCenterY(),
      "asset1"
    )
    .setOrigin(0.5, 0.5)
    .setScale(uiScale);
    this.rotation.basedisplayWidth = this.rotation.displayWidth;


    this.scaling = this.add
        .image(
          this.getCenterX() + (315 * uiScale / 2) + 100 * uiScale,
          this.getCenterY(),
          "asset2"
        )
        .setOrigin(0.5, 0.5)
        .setScale(uiScale);
    this.scaling.basedisplayWidth = this.scaling.displayWidth;

    this.scalingText = this.add.text(
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

    this.assets = [this.rotation, this.scaling];
    DEBUG && console.log("assets for difficulty options: ");
    DEBUG && console.log(this.assets);

  }
}
