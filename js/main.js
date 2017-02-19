var Nakama = {};
Nakama.configs = {
  chickenHealth       : 5,
  chickenSpeed        : 400,
  enemyType1Speed     : 30,
  enemyType2Speed     : 50,
  enemyBulletSpeed    : 300,
  enemyBulletCooldown : 0.4,
  timeToSpawnAnEnemy  : 5,
  linesSpeed : 300
};

window.onload = function(){
  Nakama.game = new Phaser.Game(960,960,Phaser.AUTO,'',
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
  Nakama.game.scale.maxWidth = 960;
  Nakama.game.scale.maxHeight = 960;
  Nakama.game.scale.pageAlignHorizontally = true;
  Nakama.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  Nakama.game.time.advancedTiming = true;

  Nakama.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
  Nakama.game.load.atlasJSONHash('sheet1', 'Assets/Spritesheet-1.png', 'Assets/Spritesheet-1.json');
  Nakama.game.load.atlasJSONHash('sheet2', 'Assets/Spritesheet-2.png', 'Assets/Spritesheet-2.json');
  Nakama.game.load.atlasJSONHash('sheet3', 'Assets/Spritesheet-3.png', 'Assets/Spritesheet-3.json');
  Nakama.game.load.spritesheet('chicken', 'Assets/chicken.png', 389, 504);
  Nakama.game.load.image('starting', 'Assets/starting.png');
}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;

  Nakama.background = Nakama.game.add.tileSprite(0, 0, Nakama.game.world.width, Nakama.game.world.height, "sheet1", "Map.png");

  Nakama.linesGroup      = Nakama.game.add.physicsGroup();
  Nakama.chickenGroup    = Nakama.game.add.physicsGroup();
  Nakama.bulletGroup     = Nakama.game.add.physicsGroup();
  Nakama.blockGroup      = Nakama.game.add.physicsGroup();
  Nakama.enemyGroup      = Nakama.game.add.physicsGroup();
  Nakama.laserGroup      = Nakama.game.add.physicsGroup();

  Nakama.chicken      = [];
  Nakama.enemies      = [];
  Nakama.block        = [];
  Nakama.enemyLaser   = [];
  Nakama.enemyBullet  = [];

  Nakama.timeToSpawnAnEnemy = 0;

  Nakama.startingPoint = Nakama.linesGroup.create(Nakama.game.world.width/2, Nakama.game.world.height/2, 'starting');
  Nakama.startingPoint.anchor = new Phaser.Point(0.5, 0.5);
  Nakama.startingPoint.body.velocity.y = Nakama.configs.linesSpeed;

  Nakama.firstLine = new Lines_longStraight();
  // Nakama.firstLine.sprite.position.y = Nakama.game.world.height/2;

  //  Nakama.block.push(new SpinningBlockType1Controller(300,100));
  //  Nakama.block.push(new SpinningBlockType2Controller(300,600));
  //  Nakama.block.push(new MovingBlockType1Controller(280,300,1,
  // {
  //   minX  : 80,
  //   maxX  : 480,
  //   tweenTime : 3,
  //   timeDelay : 1
  // }));
  // Nakama.block.push(new MovingBlockType1Controller(280,350,2,
  // {
  //   minX  : 80,
  //   maxX  : 480,
  //   tweenTime : 3,
  //   timeDelay : 1
  // }));
  // Nakama.block.push(new MovingBlockType1Controller(280,400,1,
  // {
  //   minX  : 80,
  //   maxX  : 480,
  //   tweenTime : 3,
  //   timeDelay : 1
  // }));
  //
  // Nakama.block.push(new MovingBlockType2Controller(280, 400, {
  //   tweenTime : 3,
  //   minY      : 200,
  //   maxY      : 600
  // }))

  Nakama.chicken.push(new ChickenController(Nakama.game.world.width/2,800));

  Nakama.onTheLine = false;
}

// update game state each frame
var update = function(){
  if(Nakama.keyboard.isDown(Phaser.Keyboard.Q)) {
    if(Nakama.keyboard.isDown(Phaser.Keyboard.W)){
      if(Nakama.keyboard.isDown(Phaser.Keyboard.E)){
        if(Nakama.keyboard.isDown(Phaser.Keyboard.R)){
          Nakama.chicken[0].sprite.health = 500000;
        }
      }
    }
  }
  // console.log(Nakama.chicken[0].sprite.health);
  //bring the chicken sprite on top of others.
  Nakama.game.world.bringToTop(Nakama.chickenGroup);

  Nakama.background.tilePosition.y += 1;

  if (Nakama.linesGroup.children[Nakama.linesGroup.children.length - 1].position.y >= Nakama.linesGroup.children[Nakama.linesGroup.children.length - 1].height/2 - 20) {
    randomLines();
  }

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
    if(Math.round(Math.random())>=0.5){
      //random position.y and directionType for this enemy.
      Nakama.enemies.push(new EnemyType1Controller(Nakama.game.world.width - 20, Math.round(Math.random()*600 + 100), Math.round(Math.random()+1)));
      Nakama.timeToSpawnAnEnemy = 0;
    }
    else{
      //random position.x and directionType for this enemy.
      Nakama.enemies.push(new EnemyType2Controller(20, Math.round(Math.random()*600 + 100), Math.round(Math.random()+1)));
      Nakama.timeToSpawnAnEnemy = 0;
    }
  }

  //check overlap for every sprite in 2 array Chicken and EnemyLaser
  for(var i = 0; i < Nakama.chicken.length; i++){
    for(var j = 0; j < Nakama.enemyLaser.length; j++){
      if(checkOverlap(Nakama.enemyLaser[j].sprite, Nakama.chicken[i].sprite)){
        Nakama.chicken[i].sprite.damage(1);
      }
    }
  }

  Nakama.game.physics.arcade.overlap(Nakama.bulletGroup, Nakama.chickenGroup, onBulletHitChicken);
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

var randomLines = function(){
  var lineID = Math.floor(Math.random() * 8);
  switch (lineID) {
    case 0:
      new Lines_roundHole();
      break;
    case 1:
      new Lines_longStraight();
      break;
    case 2:
      new Lines_squareHole();
      break;
    case 3:
      new Lines_hexaHole();
      break;
    case 4:
      new Lines_octaHole();
      break;
    case 5:
      new Lines_pointLeft();
      break;
    case 6:
      new Lines_pointRight();
      break;
    case 7:
      new Lines_eightHole();
      break;
  }
}
