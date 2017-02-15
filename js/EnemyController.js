class EnemyController{
  constructor(x,y,directionType,configs){
    this.sprite = Nakama.enemyGroup.create(
      x,
      y,
      "assets",
      "EnemyType1.png"
    );
    this.directionType = directionType;
    this.direction = (directionType == 1)?(new Phaser.Point(0,1)):
                                          (new Phaser.Point(0,-1));
    this.configs = configs;
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.timeLaserExists = 0;
    this.timeSpriteAlive = 0;
    this.sprite.body.velocity = this.direction.setMagnitude(Nakama.configs.enemySpeed);
  }

  update(){
    this.timeSpriteAlive += Nakama.game.time.physicsElapsed;
    /*this.sprite.body.velocity.y =
      this.configs.maxDistanceTraveled/2 *
      Math.cos(2 * Math.Pi/this.configs.tweenTime * this.timeSpriteAlive);*/

    if(this.timeSpriteAlive >= 2) {
      this.sprite.kill();
      Nakama.enemies.splice(Nakama.enemies.indexOf(this), 1);
    }
    if(this.sprite.alive && this.timeSpriteAlive >= 0.5)
      this.fire();
    console.log(this.sprite.body.velocity.y);
  }

  createLaser(angle, anchor, configs){
    Nakama.updatePosition = this.sprite.position;
    Nakama.enemyLaser.push(new EnemyLaserController(
      this.sprite.position,
      angle,
      anchor,
      configs
    ));
  }

  fire(){
    //if(Nakama.enemyLaser.length == 0)
    this.createLaser(90 , new Phaser.Point(0.5, 0));
  }
}
