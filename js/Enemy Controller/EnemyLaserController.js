class EnemyLaserController {
  constructor(position, angle, anchor, configs){
    this.sprite = Nakama.laserGroup.create(
      position.x,
      position.y,
      "assets",
      "BulletType3.png"
    );
    this.sprite.angle = angle;
    this.sprite.anchor = anchor;
    this.timeExists = 0;
  }

  update() {
    this.timeExists += Nakama.game.time.physicsElapsed;
    if(this.timeExists > 0.05)
      {
        this.sprite.kill();
        Nakama.enemyLaser.splice(Nakama.enemyLaser.indexOf(this), 1);
      }
    //Make the laser move with enemy
    this.sprite.position.x = Nakama.updatePosition.x;
    this.sprite.position.y = Nakama.updatePosition.y;
  }
}
