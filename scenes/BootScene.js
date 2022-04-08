import FindItScene from "./FindItScene.js";
export default class BootScene extends FindItScene {
  constructor() {
    super("bootscene");
  }
    preload () {
      super.preload();
    }
    
    create () {
      this.scene.start('backgroundanduiscene');
    }
  }
  