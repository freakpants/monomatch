
export default class FindItScene extends Phaser.Scene {
    preload() {
        this.load.svg('bg', 'assets/drawing-4.svg');
    }

    create() {
        var bg = this.add.image(0, 0, "bg").setScale(0.39).setOrigin(0,0);
    }

    getCenterX()
    {
       return ( this.sys.canvas.width  ) * .5
    }

    getCenterY()
    {
       return ( this.sys.canvas.height  ) * .5
    }

    resize() {
        var canvas = this.game.canvas;
        canvas.style.width = document.body.offsetWidth + 'px';
        canvas.style.height = document.body.offsetHeight + 'px';
    }
}
