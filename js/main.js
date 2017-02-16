var Nakama = {};
Nakama.configs = {
  keyboard : {
    up    : Phaser.Keyboard.UP,
    down  : Phaser.Keyboard.DOWN,
    left  : Phaser.Keyboard.LEFT,
    right : Phaser.Keyboard.RIGHT
  },
  chickenHealth       : 50000,
  chickenSpeed        : 400,
  enemyType1Speed     : 30,
  enemyType2Speed     : 50,
  enemyBulletSpeed    : 300,
  enemyBulletCooldown : 0.4,
  timeToSpawnAnEnemy  : 5
};

window.onload = function(){
  Nakama.game = new Phaser.Game(640,960,Phaser.AUTO,'',
    {
      preload: preload,
      create: create,
      update: update,
      render: render
    }, false, false
  );
}

// preparations before game starts
var preload = function(){
  Nakama.game.scale.minWidth = 320;
  Nakama.game.scale.minHeight = 480;
  Nakama.game.scale.maxWidth = 640;
  Nakama.game.scale.maxHeight = 960;
  Nakama.game.scale.pageAlignHorizontally = true;
  Nakama.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  Nakama.game.time.advancedTiming = true;

  Nakama.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
  Nakama.game.load.image('background', 'Assets/Map1.png');
  Nakama.game.load.spritesheet('chicken', 'Assets/chicken.png', 389, 504);
}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;
  Nakama.chickenGroup = Nakama.game.add.physicsGroup();
  Nakama.bulletGroup  = Nakama.game.add.physicsGroup();
  Nakama.blockGroup   = Nakama.game.add.physicsGroup();
  Nakama.enemyGroup   = Nakama.game.add.physicsGroup();
  Nakama.laserGroup   = Nakama.game.add.physicsGroup();
  Nakama.chicken      = [];
  Nakama.enemies      = [];
  Nakama.block        = [];
  Nakama.enemyLaser   = [];
  Nakama.enemyBullet  = [];
  Nakama.chicken.push(new ChickenController(300,800));
  Nakama.timeToSpawnAnEnemy = 0;
//  Nakama.block.push(new SpinningBlockType1Controller(300,300));
//  Nakama.block.push(new SpinningBlockType2Controller(300,600));
}

// update game state each frame
var update = function(){
  Nakama.timeToSpawnAnEnemy += Nakama.game.time.physicsElapsed;
  for(var i = 0; i < Nakama.chicken.length; i++){
    Nakama.chicken[i].update();
  }

  for(var i = 0; i < Nakama.block.length; i++){
    Nakama.block[i].update();
  }

  for(var i = 0; i < Nakama.enemies.length; i++){
    Nakama.enemies[i].update();
  }
  for(var i = 0; i < Nakama.enemyLaser.length; i++){
    Nakama.enemyLaser[i].update();
  }

  //randomly create an enemy between type 1 and type 2 after each ... seconds.
  if(Nakama.timeToSpawnAnEnemy >= Nakama.configs.timeToSpawnAnEnemy) {
    if(Math.round(Math.random()>=0.5)){
      Nakama.enemies.push(new EnemyType1Controller(
      //random position.y and directionType for this enemy.
      620, Math.round(Math.random()*600 + 100),
      Math.round(Math.random()+1)
      ));
      Nakama.timeToSpawnAnEnemy = 0;
    }
    else{
      Nakama.enemies.push(new EnemyType2Controller(
      //random position.x and directionType for this enemy.
      20,Math.round(Math.random()*600 + 100),
        Math.round(Math.random()+1)
      ));
      Nakama.timeToSpawnAnEnemy = 0;
    }
  }

//check overlap for every sprite in 2 array Chicken and EnemyLaser
for(var i = 0; i < Nakama.chicken.length; i++){
  for(var j = 0; j < Nakama.enemyLaser.length; j++){
    if(checkOverlap(Nakama.enemyLaser[j].sprite, Nakama.chicken[i].sprite))
      Nakama.chicken[i].sprite.damage(1);
    }
  }

  Nakama.game.physics.arcade.overlap(
    Nakama.bulletGroup,
    Nakama.chickenGroup,
    onBulletHitChicken
  )
}

// before camera render (mostly for debug)
var render = function(){
  Nakama.game.debug.body;
}

//Check if two sprites overlap or not.
//Check Sprite image, not body physic ( overlap without physics)
function checkOverlap(laserSprite, chickenSprite){
  var boundsLaserSprite = laserSprite.getBounds();
  var boundsChickenSprite = chickenSprite.getBounds();
  return Phaser.Rectangle.intersects(boundsLaserSprite , boundsChickenSprite);
}

var onBulletHitChicken = function(bulletSprite, chickenSprite){
  bulletSprite.kill();
  chickenSprite.damage(1);
}
