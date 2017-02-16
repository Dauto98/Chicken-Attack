"use strict";
class ChickenController {
  constructor(x,y,configs){
    this.sprite = Nakama.chickenGroup.create(
      x,
      y,
      "chicken");
    this.sprite.scale.setTo(0.15,0.15);
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.configs = configs;
    this.sprite.animations.add('walk');
    this.sprite.body.collideWorldBounds = true;
    this.sprite.health = Nakama.configs.chickenHealth;
    this.chickenFramePerSecond = 8;
}

update(){
  //moving features and changing frame while moving.
    if(Nakama.keyboard.isDown(Nakama.configs.keyboard.up)){
      this.sprite.body.velocity.y = -this.configs.chickenSpeed;
      this.sprite.animations.play('walk',this.chickenFramePerSecond,true);
    }
    else if(Nakama.keyboard.isDown(Nakama.configs.keyboard.down)){
      this.sprite.body.velocity.y = this.configs.chickenSpeed;
      this.sprite.animations.play('walk',this.chickenFramePerSecond,true);
    }
    else this.sprite.body.velocity.y = 0;

    if(Nakama.keyboard.isDown(Nakama.configs.keyboard.left)){
      this.sprite.body.velocity.x = -this.configs.chickenSpeed;
      this.sprite.animations.play('walk',this.chickenFramePerSecond,true);
    }
    else if(Nakama.keyboard.isDown(Nakama.configs.keyboard.right)){
      this.sprite.body.velocity.x = this.configs.chickenSpeed;
      this.sprite.animations.play('walk',this.chickenFramePerSecond,true);
    }
    else this.sprite.body.velocity.x = 0;
    console.log(this.sprite.health);
  }
}
