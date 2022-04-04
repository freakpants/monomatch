import { projective_sets } from 'objects.js';
export default class TimeScreen extends Phaser.Scene {
  constructor() {
    super("timescreen");
  }

  preload() {}

  create() {
    this.initialTime = 2;

    // Each 1000 ms call onEvent
    const timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this,
      loop: true,
    });

    console.log("initiating timer scene");
    window.addEventListener("resize", this.resize);
    this.resize();
    var graphics = this.add.graphics();

    graphics.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x002171, 0x002171);
    graphics.fillRect(
      0,
      0,
      document.body.offsetWidth,
      document.body.offsetHeight
    );

    /* this.timerText = new Text(
      this,
      this.getCenterX(),
      this.getCenterY(),
      "This is the timer screen until a new round begins.\n" + this.initialTime,
      {
        fontSize: "30px",
        align: "center",
        color: "#ffffff",
        fontFamily: "Arial",
      }
    ); */
    this.text = this.add.text(this.getCenterX(),
    this.getCenterY(),
    "This is the timer screen until a new round begins.\n" + this.initialTime,
    {
      fontSize: "30px",
      align: "center",
      color: "#ffffff",
      fontFamily: "Arial",
    });

    this.text.setOrigin(0.5, 0.5);

    this.add.text(this.sys.canvas.width - 110, this.sys.canvas.height - 20, "Round " + document.round + " of " + document.maxRound , { fontSize: "30px", align: "center", color: '#ffffff', fontFamily: 'Luckiest Guy' }).setOrigin(0.5, 0.5);
   

    this.assets = [];
  }

  getCenterX() {
    return this.sys.canvas.width * 0.5;
  }

  getCenterY() {
    return this.sys.canvas.height * 0.5;
  }

  onEvent() {
    console.log(this.initialTime);
    if(this.initialTime !== 1){
           console.log("initalTime is not 1");
        this.initialTime -= 1; // One second
        this.text.setText("This is the timer screen until a new round begins.\n" + this.initialTime); 
    } else {
        DEBUG && console.log("changing to scene for guessing");
        
        // inform the controllers a new round is beginning
        const message = [];
        message.push({ type: "countdown_over" });
        air_console.broadcast(message);

        document.set_id = document.next_set_id;
        document.set = projective_sets.filter(obj => {
            return obj.id === document.set_id
        });
        this.scene.start("guessing");
        document.somebodyScoredThisRound = false;
    }

  }

  resize() {
    var canvas = this.game.canvas;
    canvas.style.width = document.body.offsetWidth + "px";
    canvas.style.height = document.body.offsetHeight + "px";
  }
}
