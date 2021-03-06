import { projective_sets } from "../objects.js";
import FindItScene from './FindItScene.js';
import sceneChange from '../sceneChange.js';
export default class TimeScreen extends FindItScene {
  constructor() {
    super("timescreen");
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    document.air_console.showAd();
    const uiScale = document.uiScale;

    if(document.lowPerformance){
      this.initialTime = 5;
    } else {
      this.initialTime = 2;
    }
    

    // Each 1000 ms call onEvent
    const timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this,
      loop: true,
    });

    console.log("initiating timer scene");

    this.winner = this.getShortNickname(document.winningPlayerId);

    this.add.image(
      this.getCenterX(),
      this.getCenterY() - 150 * uiScale,
      document.profile_pictures[document.winningPlayerId]
    );

    this.text = this.add.text(
      this.getCenterX(),
      this.getCenterY(),
      this.winner +
        "\nwas the fastest!\nNext Round begins in " +
        this.initialTime,
      {
        fontSize: 45 * uiScale + "px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Luckiest Guy",
      }
    );

    this.text.setOrigin(0.5, 0.5);
    this.assets = [];
  }

  onEvent() {
    if(document.adShowing){
      return;
    }
    console.log(this.initialTime);
    if (this.initialTime !== 1) {
      if(!document.sfxOff){
        this.clock.play();
      }
      console.log("initalTime is not 1");
      this.initialTime -= 1; // One second
      this.text.setText(
        this.winner +
          "\nwas the fastest!\nNext Round begins in " +
          this.initialTime
      );
    } else {
      this.DEBUG && console.log("changing to scene for guessing");

      // inform the controllers a new round is beginning
      const message = [];
      message.push({ type: "countdown_over" });
      document.air_console.broadcast(message);

      document.set_id = document.next_set_id;
      document.set = projective_sets.filter((obj) => {
        return obj.id === document.set_id;
      });
      // redraw the round amount
      document.game.scene.getScene('backgroundanduiscene').events.emit("optionChange", "round");
      sceneChange("guessing");
      document.somebodyScoredThisRound = false;
    }
  }
}
