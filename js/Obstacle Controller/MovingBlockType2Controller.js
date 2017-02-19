class MovingBlockType2Controller {
  constructor(y, configs){
    this.sprite = Nakama.linesGroup.create(
      Nakama.game.world.width/2,
      y,
      "sheet2",
      "Block4.3.png"
    )
    this.configs = configs;
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.configs.centerY = (this.configs.minY + this.configs.maxY)/2;
    this.configs.movementDistance = this.configs.maxY - this.configs.minY;
    this.timeSinceLastSpawn = 0;
    this.sprite.body.velocity.y = Nakama.configs.linesSpeed;
  }

  update(){
    this.timeSinceLastSpawn += Nakama.game.time.physicsElapsed;
    this.sprite.position.y = this.configs.centerY + this.configs.movementDistance * Math.sin(this.timeSinceLastSpawn/this.configs.tweenTime * Math.PI * 2);
    console.log(this.sprite.position.y);
  }
}
