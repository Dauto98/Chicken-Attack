class EnemyType2Controller {
  constructor(x,y,directionType,configs){
    this.sprite = Nakama.enemyGroup.create(
      x,
      y,
      "assets",
      "EnemyType2.png"
    )
    this.sprite.anchor = new Phaser.Point(0.5 , 0.5);
    this.directionType = directionType;
    this.direction = (this.directionType==1)?(new Phaser.Point(1,0)):
                                             (new Phaser.Point(-1,0));
    this.sprite.body.velocity =
      this.direction.setMagnitude(Nakama.configs.enemyType2Speed);
    this.timeSpriteAlive = 0;
  }

  update(){
    this.timeSpriteAlive += Nakama.game.time.physicsElapsed;
    //kill this enemy after 1.5s.
    if(this.timeSpriteAlive >= 1.5) {
      this.sprite.kill();
      Nakama.enemies.splice(Nakama.enemies.indexOf(this),1);
    }
    if(this.sprite.alive && this.timeSpriteAlive > 0.5) this.fire();
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
    //if the enemy is not near the center of the map, let it fire to the center.
    if(this.sprite.position.x <= 240 || this.sprite.position.x >= 400){
      this.createLaser(Nakama.game.math.angleBetween(
        this.sprite.position.x,
        this.sprite.position.y,
        320,
        360)/Math.PI*180 - 90,
        new Phaser.Point(0.5 , 0));
      }
    //if the enemy near and on the left side of the map, let it fire with a random
    //angle between -10 and -20.
    else if(this.sprite.position.x >= 240 && this.sprite.position.x < 320){
      this.createLaser(-(Math.round(Math.random()*10+10)),new Phaser.Point(0.5,0));
    }
    //if the enemy near and on the right side of the map, let it fire with a random
    //angle between 10 and 20.
    else if(this.sprite.position.x > 320){
      this.createLaser(Math.round(Math.random()*10+10), new Phaser.Point(0.5,0));
    }
  }
}
