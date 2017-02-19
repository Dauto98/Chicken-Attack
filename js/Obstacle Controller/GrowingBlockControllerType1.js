class GrowingBlockControllerType1 {
  constructor(x , y , configs){
    this.sprite = Nakama.blockGroup.create(
    x,
    y,
    "assets",//png file here
    "Spaceship1-Player.png"
  );
    this.configs = configs;
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.timeToScale = 2;
    this.timeToScale2 = 4;
    this.timeExists = 0;
  }

  update(){
    this.timeToScale += Nakama.game.time.physicsElapsed;
    this.timeExists += Nakama.game.time.physicsElapsed;
    if(this.timeExists <= this.configs.timeExists){
      if(this.timeToScale < 4)
        this.sprite.scale.setTo(this.timeToScale/2 , this.timeToScale/2);
      if(this.timeToScale >= 4) {
        this.timeToScale2 -= Nakama.game.time.physicsElapsed;
        this.sprite.scale.setTo(this.timeToScale2/2 , this.timeToScale2/2);
      }
    }
    else this.sprite.destroy();
  }
}
