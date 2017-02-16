"use strict";
class SpinningBlockType2Controller {
  constructor(x,y,configs) {
    this.sprite = Nakama.blockGroup.create(
      x,
      y,
      "assets",
      "Spaceship2-Player.png"
    );
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.sprite.angle = 0;
    this.turnRate = 0.5;
  }

  update(){
    this.sprite.angle += this.turnRate;
  }
}
