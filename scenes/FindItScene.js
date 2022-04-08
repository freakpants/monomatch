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

  getCenterX() {
    return this.sys.canvas.width * 0.5;
  }

  getCenterY() {
    return this.sys.canvas.height * 0.5;
  }
}
