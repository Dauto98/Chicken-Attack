class MovingBlockType2Controller {
  constructor(x, y, configs){
    this.sprite = Nakama.blockGroup.create(
      x,
      y,
      "assets",
      "EnemyType4.png"
    )
    this.configs = configs;
    this.sprite.checkWorldBounds = true;
    this.sprite.outOfBoundsKill = true;
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.configs.centerY = (this.configs.minY + this.configs.maxY)/2;
    this.configs.movementDistance = this.configs.maxY - this.configs.minY;
    this.timeSinceLastSpawn = 0;
  }

  update(){
    this.timeSinceLastSpawn += Nakama.game.time.physicsElapsed;
    this.sprite.position.y =
    this.configs.centerY +
    this.configs.movementDistance *
    Math.sin(this.timeSinceLastSpawn/this.configs.tweenTime * Math.PI * 2);
    console.log(this.sprite.position.y);
    if(!this.sprite.alive) this.sprite.destroy();
  }
}
