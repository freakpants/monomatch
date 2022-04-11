import { objects } from "../objects.js";
export default class FindItScene extends Phaser.Scene {
  preload() {
    objects.forEach((object) => {
      this.load.image("asset" + object.id, "assets/asset" + object.id + ".png");
    });
    this.load.svg("logo", "assets/find_it_logo.svg");
    this.load.svg("bg", "assets/drawing-4.svg");
    this.load.image("music", "assets/music.png");
    this.load.image("music-slash", "assets/music-slash.png");
    this.load.plugin(
      "rexglowfilter2pipelineplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilter2pipelineplugin.min.js",
      true
    );
  }

  create() {
    this.postFxPlugin = this.plugins.get("rexglowfilter2pipelineplugin");
  }

  update(){
    if(document.game.scale.gameSize._width !== document.game.scale.parentSize._width || document.game.scale.gameSize._height !== document.game.scale.parentSize._height){
      DEBUG && console.log("resize event from scene:" + this.scene.key);
      DEBUG && console.log("active scenes:");
      DEBUG && console.log(document.game.scene.getScenes(true));
      document.uiScale = (1920 * 1016) / (document.game.scale.parentSize._width * document.game.scale.parentSize._height);
      document.game.scale.resize(document.game.scale.parentSize._width, document.game.scale.parentSize._height);
      // restart all active scenes so the background is also resized
      document.game.scene.getScenes(true)[1].scene.restart();
      document.game.scene.getScene("backgroundanduiscene").scene.restart({origin: "resize", mainmenuactive: document.game.scene.getScenes(true)[1].scene.key === 'mainmenu'});
    } 
  }

  getCenterX() {
    return this.sys.canvas.width * 0.5;
  }

  getCenterY() {
    return this.sys.canvas.height * 0.5;
  }
}
