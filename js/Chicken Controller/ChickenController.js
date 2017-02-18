class ChickenController {
  constructor(x,y,configs){
    this.sprite = Nakama.chickenGroup.create(
      x,
      y,
      "chicken");
    this.sprite.scale.setTo(0.4,0.4);
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.configs = configs;
    this.sprite.animations.add('walk');
    this.sprite.body.collideWorldBounds = true;
    this.sprite.health = Nakama.configs.chickenHealth;
    this.chickenFramePerSecond = 6;
    this.timeChangeColor = 0;
    this.invulnerableState = false;
}

update(){
    this.sprite.position = Nakama.game.input.activePointer;
    this.sprite.animations.play('walk',this.chickenFramePerSecond, true);
    if(this.sprite.health == 0) this.sprite.kill();
    if(this.invulnerableState == false) this.sprite.tint = 0xffffff;
    else if(this.invulnerableState == true) this.sprite.tint = 0xff0000;
  }

  damage(){
    if(this.invulnerableState == false){
      this.sprite.health -= 1;
      this.toggleInvulnerable();
      Nakama.game.time.events.add(2000, this.toggleInvulnerable, this);
    }
  }

  toggleInvulnerable(){
    this.invulnerableState = !this.invulnerableState;
  }
}
