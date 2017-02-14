"use strict";
class ChickenController {
  constructor(x,y,configs){
    this.sprite = Nakama.chickenGroup.create(
      x,
      y,
      "chicken");
    this.sprite.scale.setTo(0.15,0.15)
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.configs = configs;
    this.sprite.animations.add('walk');
}

update(){
    if(Nakama.keyboard.isDown(Nakama.configs.keyboard.up)){
      this.sprite.body.velocity.y = -this.configs.chickenSpeed;
      this.sprite.animations.play('walk',6,true);
    }
    else if(Nakama.keyboard.isDown(Nakama.configs.keyboard.down)){
      this.sprite.body.velocity.y = this.configs.chickenSpeed;
      this.sprite.animations.play('walk',6,true);
    }
    else this.sprite.body.velocity.y = 0;

    if(Nakama.keyboard.isDown(Nakama.configs.keyboard.left)){
      this.sprite.body.velocity.x = -this.configs.chickenSpeed;
      this.sprite.animations.play('walk',6,true);
    }
    else if(Nakama.keyboard.isDown(Nakama.configs.keyboard.right)){
      this.sprite.body.velocity.x = this.configs.chickenSpeed;
      this.sprite.animations.play('walk',6,true);
    }

    else this.sprite.body.velocity.x = 0;
  }
}
