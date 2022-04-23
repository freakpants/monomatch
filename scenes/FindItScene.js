import { objects } from "../objects.js";
import eventsCenter from "../EventsCenter.js";
export default class FindItScene extends Phaser.Scene {
  preload() {
    this.load.audio('success', 'audio/success.mp3');
    this.load.audio('click', 'audio/click.mp3');
    this.load.audio('clock', 'audio/clock.mp3');
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

    this.load.plugin(
      "rexglowfilter2pipelineplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilter2pipelineplugin.min.js",
      true
    );
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

  drawChevrons(leftOnly = false) {
    const uiScale = document.uiScale;
    this.chevronLeft = this.add.image((100*uiScale), this.getCenterY(), 'chevron-right').setOrigin(0.5, 0.5);
    this.chevronLeft.flipX = true;
    this.chevronLeft.setScale(uiScale);
    if(!leftOnly){
      this.chevronRight = this.add.image(document.game.canvas.width - (100*uiScale), this.getCenterY(), 'chevron-right').setOrigin(0.5, 0.5);
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
    eventsCenter.once('stopScene', this.stop, this);

    this.postFxPlugin = this.plugins.get("rexglowfilter2pipelineplugin");
    this.resizeHappening = false;
    this.success = this.sound.add("success");
    this.clock =  this.sound.add("clock");
    this.click = this.sound.add("click");
  }

  update() {
    if(document.playClick){
      if(!document.sfxOff){
        this.click.play();
      }
      document.playClick = false;
    }
    if(document.game.scene.getScenes(true)[2] !== undefined){
      // there should never be a third scene!
      document.game.scene.getScenes(true)[2].scene.stop();
      document.game.scene.getScenes(true)[1].scene.stop();
      sceneChange(document.gameScene);
    }

    if (
      (!this.resizeHappening &&
        document.game.scale.gameSize._width !==
          document.game.scale.parentSize._width) ||
      document.game.scale.gameSize._height !==
        document.game.scale.parentSize._height
    ) {
      this.resizeHappening = true;
      this.time.delayedCall(1000, () => (this.resizeHappening = false));
      DEBUG && console.log("resize event from scene:" + this.scene.key);
      DEBUG && console.log("active scenes:");
      DEBUG && console.log(document.game.scene.getScenes(true));
      document.uiScale = Math.sqrt(
        (document.game.scale.parentSize._width *
          document.game.scale.parentSize._height) /
          (1920 * 1016)
      );
      document.game.scale.resize(
        document.game.scale.parentSize._width,
        document.game.scale.parentSize._height
      );
      // restart all active scenes so the background is also resized
      if (document.game.scene.getScenes(true).length > 1) {
        // null check in case our background scene crashes
        document.game.scene.getScenes(true)[1].scene.restart();
      }
      DEBUG && console.log("attempting to get backgorund scene:");
      DEBUG &&
        console.log(document.game.scene.getScene("backgroundanduiscene"));
      const bgScene = document.game.scene.getScene("backgroundanduiscene");
      const secondScene = document.game.scene.getScenes(true)[1];
      if (bgScene !== undefined && secondScene !== undefined) {
        bgScene.scene.restart({
          origin: "resize",
          mainmenuactive:
            document.gameScene === "mainmenu" ||
            document.gameScene === "musicoptionsscene" ||
            document.gameScene === "roundoptionsscene" ||
            document.gameScene === "difficultyoptionsscene" ||
            document.gameScene === "credits" ||
            document.gameScene === "gameover"||
            document.gameScene === "highscore"
        });
      } else {
        // attempt to restart the crashed bg
        this.scene.launch("backgroundanduiscene");
      }
    }
  }

  getCenterX() {
    return this.sys.canvas.width * 0.5;
  }

  getCenterY() {
    return this.sys.canvas.height * 0.5;
  }

  stop(key){
    console.log("stop was called with key " + key);
    console.log("my key is " + this.scene.key);
    if(this.scene.key === key){
      this.scene.stop();
    }
  }
}
