import { objects } from "../objects.js";
import eventsCenter from "../EventsCenter.js";
import sceneChange from "../sceneChange.js";
class FindItScene extends Phaser.Scene {
  preload() {
    this.load.audio("success", "audio/success.mp3");
    this.load.audio("click", "audio/click.mp3");
    this.load.audio("clock", "audio/clock.mp3");
    objects.forEach((object) => {
      this.load.image("asset" + object.id, "assets/asset" + object.id + ".png");
    });
    this.load.svg("logo", "assets/find_it_logo.svg");
    this.load.image("music", "assets/music.png");
    this.load.image("music-big", "assets/music-big.png");
    this.load.image("music-slash", "assets/music-slash.png");
    this.load.image("music-slash-big", "assets/music-slash-big.png");

    this.load.image("sfx", "assets/sfx.png");
    this.load.image("sfx-big", "assets/sfx-big.png");
    this.load.image("sfx-cross", "assets/sfx-cross.png");
    this.load.image("sfx-cross-big", "assets/sfx-cross-big.png");

    this.load.image("chevron-right", "assets/chevron-right.png");

    /* this.load.plugin(
      "rexglowfilter2pipelineplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilter2pipelineplugin.min.js",
      true
    ); */
    document.profile_pictures = [];
    if (typeof air_console !== "undefined") {
      air_console.getControllerDeviceIds().forEach((id) => {
        const asset_id = "profile_" + id;
        this.load.image(
          asset_id,
          air_console.getProfilePicture(id, Math.floor(110 * document.uiScale))
        );
        document.profile_pictures[id] = asset_id;
      });
    }
  }

  init(){
    this.DEBUG === document.debug;
  }

  drawChevrons(leftOnly = false) {
    const uiScale = document.uiScale;
    this.chevronLeft = this.add
      .image(100 * uiScale, this.getCenterY(), "chevron-right")
      .setOrigin(0.5, 0.5);
    this.chevronLeft.flipX = true;
    this.chevronLeft.setScale(uiScale);
    if (!leftOnly) {
      this.chevronRight = this.add
        .image(
          document.game.canvas.width - 100 * uiScale,
          this.getCenterY(),
          "chevron-right"
        )
        .setOrigin(0.5, 0.5);
      this.chevronRight.setScale(uiScale);
    }
  }

  rotateAssets() {
    this.assets.forEach((asset) => {
      asset.rotation += 0.01;
    });
  }

  scaleAssets() {
    this.assets.forEach((asset) => {
      if (asset.direction === "up") {
        if (asset.displayWidth >= asset.basedisplayWidth) {
          asset.displayWidth--;
          asset.displayHeight--;
          asset.direction = "down";
        } else {
          asset.displayWidth++;
          asset.displayHeight++;
        }
      } else {
        if (asset.displayWidth <= asset.basedisplayWidth * 0.3) {
          asset.displayWidth++;
          asset.displayHeight++;
          asset.direction = "up";
        } else {
          asset.displayWidth--;
          asset.displayHeight--;
        }
      }
    });
  }

  create() {
    eventsCenter.once("stopScene", this.stop, this);

    // this.postFxPlugin = this.plugins.get("rexglowfilter2pipelineplugin");
    this.resizeHappening = false;
    this.success = this.sound.add("success");
    this.clock = this.sound.add("clock");
    this.click = this.sound.add("click");
    this.eventsCenter = eventsCenter;
  }

  update() {
    if (document.playClick) {
      this.DEBUG && console.log("trying to play click.");
      if (!document.sfxOff) {
        this.click.play();
      }
      document.playClick = false;
    }
    if (document.game.scene.getScenes(true)[2] !== undefined) {
      // there should never be a third scene!
      document.game.scene.getScenes(true)[2].scene.stop();
      document.game.scene.getScenes(true)[1].scene.stop();
      sceneChange(document.gameScene);
    }
    if (document.startBackground) {
      this.DEBUG && console.log("restarting bg");
      this.scene.launch("backgroundanduiscene", { origin: "resize" });
      document.startBackground = false;
    }
  }

  getShortNickname(player_id){
    let nickname = document.air_console.getNickname(player_id);
    if (nickname.length > 16) {
      nickname = nickname.replace(/(.{13})..+/, "$1…");
    }
    return nickname;
  }

  restartActiveScene() {
    // does not work when called in update of finditscene
    // restart the active scene
    let scene = document.gameScene;
    eventsCenter.emit("stopScene", scene);
    this.scene.launch(scene);
  }

  getCenterX() {
    return this.sys.canvas.width * 0.5;
  }

  getCenterY() {
    return this.sys.canvas.height * 0.5;
  }

  stop(key) {
    console.log("stop was called with key " + key);
    console.log("my key is " + this.scene.key);
    if (this.scene.key === key) {
      this.scene.stop();
    }
  }
}
export default FindItScene;