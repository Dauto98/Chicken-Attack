class ChickenController {
  constructor(x,y,configs){
    this.sprite = Nakama.chickenGroup.create(x, y, "chicken");
    
    this.sprite.scale.setTo(0.1,0.1);
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.configs = configs;
    this.sprite.animations.add('walk');
    this.sprite.body.collideWorldBounds = true;
    this.sprite.health = Nakama.configs.chickenHealth;
    this.chickenFramePerSecond = 6;
}

update(){
    this.sprite.position = Nakama.game.input.activePointer;
    this.sprite.animations.play('walk',this.chickenFramePerSecond, true);
  }
}
