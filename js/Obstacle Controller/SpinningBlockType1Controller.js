"use strict";
class SpinningBlockType1Controller {
  constructor(y,configs) {
    this.sprite = Nakama.linesGroup.create(
      Nakama.game.world.width/2,
      y,
      "sheet2",
      "Block.png"
    );
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.sprite.angle = 0;
    this.timeSinceLastSpin = 0;
    this.sprite.body.velocity.y = Nakama.configs.linesSpeed;
  }

  update(){
      this.timeSinceLastSpin += Nakama.game.time.physicsElapsed;
      //Change angle every 0.8s
      if(this.timeSinceLastSpin >= 0.8) {
        this.sprite.angle += 90;
        this.timeSinceLastSpin = 0;
    }
  }
}
