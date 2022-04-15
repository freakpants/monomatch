import FindItScene from "./FindItScene.js";
export default class HighScore extends FindItScene {
  constructor() {
    super("highscore");
  }

  preload() {
    super.preload();
    const url =
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridtableplugin.min.js";
    this.load.plugin("rexgridtableplugin", url, true);

    document.profile_pictures = [];
    air_console.getControllerDeviceIds().forEach((id) => {
      const asset_id = "profile_" + id;
      this.load.image(asset_id, air_console.getProfilePicture(id));
      document.profile_pictures[id] = asset_id;
    });
    DEBUG && console.log("profile pictures:");
    DEBUG && console.log(document.profile_pictures);
  }

  
  update() {
    super.update();
    if(document.highScoreSettingChanged){
      const levelname =
      document.highScoreRounds +
      " Rounds - " +
      document.highScorePlayers +
      " Players";
    const levelversion =
      document.highScoreRounds + "-" + document.highScorePlayers;
    air_console.requestHighScores(levelname, levelversion);
    }
  }

  create() {
    super.create(roundAmount);

    const uiScale = document.uiScale;
    var roundAmount = false;

    this.scoreText = this.add
      .text(
        this.getCenterX(),
        100 * uiScale,
        "Loading HighScores...",
        {
          fontSize: 45 * uiScale + "px",
          align: "center",
          color: "#ffffff",
          fontFamily: "Luckiest Guy",
        }
      )
      .setOrigin(0.5, 0.5);
  }
}
