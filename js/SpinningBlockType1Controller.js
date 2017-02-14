"use strict";
class SpinningBlockType1Controller {
  constructor(x,y,configs) {
    this.sprite = Nakama.blockGroup.create(
      x,
      y,
      "assets",
      "Spaceship1-Player.png"
    );
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.sprite.angle = 0;
    this.timeSinceLastSpin = 0;
  }

  update(){
      this.timeSinceLastSpin += Nakama.game.time.physicsElapsed;
      if(this.timeSinceLastSpin >= 0.8) {
        this.sprite.angle += 90;
        this.timeSinceLastSpin = 0;
    }
  }
}
