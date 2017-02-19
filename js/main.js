var Nakama = {};
Nakama.configs = {
  chickenHealth       : 5,
  chickenSpeed        : 400,
  enemyType1Speed     : 30,
  enemyType2Speed     : 100,
  enemyBulletSpeed    : 300,
  enemyBulletCooldown : 0.4,
  timeToSpawnAnEnemy  : 5,
  linesSpeed : 300
};

window.onload = function(){
  Nakama.game = new Phaser.Game(960,960,Phaser.CANVAS,'',
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
  Nakama.game.load.atlasJSONHash('sheet1', 'Assets/Map.png', 'Assets/Map.json');
  Nakama.game.load.atlasJSONHash('sheet2', 'Assets/Block.png', 'Assets/Block.json');
  Nakama.game.load.atlasJSONHash('sheet3', 'Assets/Line.png', 'Assets/Line.json');
  Nakama.game.load.spritesheet('chicken', 'Assets/chicken3.png', 117, 155);
}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;
  Nakama.game.input.activePointer.x = Nakama.game.world.width/2;
  Nakama.game.input.activePointer.y = Nakama.game.world.height/2;

  Nakama.background = Nakama.game.add.tileSprite(0, 0, Nakama.game.world.width, Nakama.game.world.height, "sheet1", "Map3.png");

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
  Nakama.lines        = [];
  Nakama.checkOverlap = [];

  Nakama.timeToSpawnAnEnemy = 0;

  new Lines_longStraight(Nakama.game.world.width/2, Nakama.leftlinesGroup);
  Nakama.chicken.push(new ChickenController(300,800));
}

// update game state each frame
var update = function(){


  //Cheat code 500,000 health
  if(Nakama.keyboard.isDown(Phaser.Keyboard.Q)) {
    if(Nakama.keyboard.isDown(Phaser.Keyboard.W)){
      if(Nakama.keyboard.isDown(Phaser.Keyboard.E)){
        if(Nakama.keyboard.isDown(Phaser.Keyboard.R)){
          Nakama.chicken[0].sprite.health = 500000;
        }
      }
    }
  }
  //bring the chicken sprite on top of others.
  Nakama.game.world.bringToTop(Nakama.chickenGroup);

  Nakama.background.tilePosition.y += 1;

  if (Nakama.linesGroup.children[Nakama.linesGroup.children.length - 1].position.y >= Nakama.linesGroup.children[Nakama.linesGroup.children.length - 1].height/2 - 10) {
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
        if(checkOverlap(Nakama.enemyLaser[j].sprite,Nakama.chicken[i].sprite))
          Nakama.chicken[i].damage();
      }
  }

  Nakama.game.physics.arcade.overlap(Nakama.bulletGroup,
    Nakama.chickenGroup,
    onBulletHitChicken);
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

var onBulletHitChicken = function(bulletSprite){
  bulletSprite.kill();
  Nakama.chicken[0].damage();
}

var randomLines = function(){
  var lineID = Math.floor(Math.random() * 8);
  switch (lineID) {
    case 0:
      Nakama.lines.push(new Lines_roundHole());
      break;
    case 1:
      Nakama.lines.push(new Lines_longStraight());
      break;
    case 2:
      Nakama.lines.push(new Lines_squareHole());
      break;
    case 3:
      Nakama.lines.push(new Lines_hexaHole());
      break;
    case 4:
      Nakama.lines.push(new Lines_octaHole());
      break;
    case 5:
      Nakama.lines.push(new Lines_pointLeft());
      break;
    case 6:
      Nakama.lines.push(new Lines_pointRight());
      break;
    case 7:
      Nakama.lines.push(new Lines_eightHole());
      break;
  }
}
