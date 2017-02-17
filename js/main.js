var Nakama = {};
Nakama.configs = {
<<<<<<< HEAD
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
=======
  linesSpeed : 500
>>>>>>> master
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
<<<<<<< HEAD
  Nakama.game.load.image('background', 'Assets/Map1.png');
  Nakama.game.load.spritesheet('chicken', 'Assets/chicken.png', 389, 504);
=======
  Nakama.game.load.image('gray_background', 'Assets/gray_background.png');
  Nakama.game.load.image('red_background', 'Assets/red_background.png');
  Nakama.game.load.image('straght_line', 'Assets/main_line.png');
  Nakama.game.load.image('hole_line', 'Assets/line1.png');
  Nakama.game.load.image('thin_line', 'Assets/thin_line.png');
>>>>>>> master
}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;
<<<<<<< HEAD
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
  Nakama.timeToSpawnAnEnemy = 0;
//  Nakama.block.push(new SpinningBlockType1Controller(300,300));
//  Nakama.block.push(new SpinningBlockType2Controller(300,600));
  Nakama.block.push(new MovingBlockController(280,300,1,
  {
    minX  : 80,
    maxX  : 480,
    tweenTime : 3,
    timeDelay : 1
  }));
  Nakama.block.push(new MovingBlockController(280,350,2,
  {
    minX  : 80,
    maxX  : 480,
    tweenTime : 3,
    timeDelay : 1
  }));
  Nakama.block.push(new MovingBlockController(280,400,1,
  {
    minX  : 80,
    maxX  : 480,
    tweenTime : 3,
    timeDelay : 1
  }));
  Nakama.chicken.push(new ChickenController(300,800));
=======

  Nakama.backgroundLeft = Nakama.game.add.tileSprite(0, 0, 320, 960, "gray_background");
  Nakama.backgroundRight = Nakama.game.add.tileSprite(320, 0, 320, 960, "red_background");

  Nakama.graph = Nakama.game.add.graphics(Nakama.game.width/2, 0);
  Nakama.graph.lineStyle(5, 0xECEFF1);
  Nakama.graph.lineTo(0, Nakama.game.height);

  Nakama.leftLinesGroup = Nakama.game.add.physicsGroup();
  Nakama.rightLinesGroup = Nakama.game.add.physicsGroup();

  new Lines_longStraight(160, Nakama.leftLinesGroup);
  new Lines_longStraight(480, Nakama.rightLinesGroup);
>>>>>>> master
}

// update game state each frame
var update = function(){
<<<<<<< HEAD
  //bring the chicken sprite on top of others.
  Nakama.game.world.bringToTop(Nakama.chickenGroup)
;
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
=======
  Nakama.backgroundLeft.tilePosition.y += 1;
  Nakama.backgroundRight.tilePosition.y += 1;

  if (Nakama.leftLinesGroup.children[Nakama.leftLinesGroup.children.length - 1].position.y >= Nakama.leftLinesGroup.children[Nakama.leftLinesGroup.children.length - 1].height/2 - 10) {
    randomLines(Nakama.leftLinesGroup);
  }

  if (Nakama.rightLinesGroup.children[Nakama.rightLinesGroup.children.length - 1].position.y >= Nakama.rightLinesGroup.children[Nakama.rightLinesGroup.children.length - 1].height/2 - 10) {
    randomLines(Nakama.rightLinesGroup);
  }
}

// before camera render (mostly for debug)
var render = function(){}

var randomLines = function(linesGroup){
  var x = 0;
    if (linesGroup === Nakama.leftLinesGroup) {
    x = 160;
  } else {
    x = 480;
  }

  var lineID = Math.floor(Math.random() * 2);
  switch (lineID) {
    case 0:
      new Lines_longStraight(x, linesGroup);
      break;
    default:
      new Lines_hole(x, linesGroup);
  }
>>>>>>> master
}
