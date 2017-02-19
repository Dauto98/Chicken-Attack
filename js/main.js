var Nakama = {};
Nakama.configs = {
  chickenHealth       : 5,
  enemyType1Speed     : 100,
  enemyType2Speed     : 100,
  enemyBulletSpeed    : 500,
  enemyBulletCooldown : 0.4,
  timeToSpawnAnEnemy  : 5,
  obstaclesCooldown   : 5,
  linesSpeed          : 300

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
  Nakama.game.load.image('starting', 'Assets/starting.png');
  Nakama.game.load.atlasJSONHash('sheet1', 'Assets/Map.png', 'Assets/Map.json');
  Nakama.game.load.atlasJSONHash('sheet2', 'Assets/Block.png', 'Assets/Block.json');
  Nakama.game.load.atlasJSONHash('sheet3', 'Assets/Line.png', 'Assets/Line.json');
  Nakama.game.load.spritesheet('chicken', 'Assets/chicken3.png', 117, 155);
  Nakama.game.load.image('Scoreboard1', 'Assets/healthdemo5.png');
  Nakama.game.load.image('Scoreboard2', 'Assets/healthdemo4.png');
  Nakama.game.load.image('Scoreboard3', 'Assets/healthdemo3.png');
  Nakama.game.load.image('Scoreboard4', 'Assets/healthdemo2.png');
  Nakama.game.load.image('Scoreboard5', 'Assets/healthdemo1.png');
  Nakama.game.load.image('Scoreboard0', 'Assets/healthdemo6.png');
  Nakama.game.load.image('gameOver', 'Assets/GOV.png');
  Nakama.game.load.image('restart','Assets/Restart.png');

}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;
  Nakama.game.input.activePointer.x = Nakama.game.world.width/2;
  Nakama.game.input.activePointer.y = Nakama.game.world.height/2;

  // background
  Nakama.background = Nakama.game.add.tileSprite(0, 0, Nakama.game.world.width, Nakama.game.world.height, "sheet1", "Map3.png");

  Nakama.linesGroup      = Nakama.game.add.physicsGroup();
  Nakama.chickenGroup    = Nakama.game.add.physicsGroup();
  Nakama.bulletGroup     = Nakama.game.add.physicsGroup();
  // Nakama.blockGroup      = Nakama.game.add.physicsGroup();
  Nakama.enemyGroup      = Nakama.game.add.physicsGroup();
  Nakama.laserGroup      = Nakama.game.add.physicsGroup();

  Nakama.chicken      = [];
  Nakama.enemies      = [];
  Nakama.block        = [];
  Nakama.enemyLaser   = [];
  Nakama.enemyBullet  = [];

  Nakama.timeToSpawnAnEnemy = 0;
  Nakama.timeToSpawnAnObstacle = 0;

  // starting block
  Nakama.startingPoint = Nakama.linesGroup.create(Nakama.game.world.width/2, Nakama.game.world.height/2, 'starting');
  Nakama.startingPoint.anchor = new Phaser.Point(0.5, 0.5);
  Nakama.startingPoint.body.velocity.y = Nakama.configs.linesSpeed;

  // first line is straight line
  Nakama.firstLine = new Lines_longStraight();

  // add chicken
  Nakama.chicken.push(new ChickenController(Nakama.game.world.width/2, 800));

  Nakama.score = 0;
  Nakama.highScore;
  Nakama.scoreBoard;
}

// update game state each frame
var update = function(){
  if(Nakama.chicken[0].sprite.alive){
    Nakama.score += Nakama.game.time.physicsElapsed;
  }
  else Nakama.score += 0;
  if(Nakama.chicken.length != 0){
    switch(Nakama.chicken[0].sprite.health){
      case 1 : {
        scoreBoard = Nakama.game.add.image(0, 800, 'Scoreboard1');
        break;
      }
      case 2 : {
        scoreBoard = Nakama.game.add.image(0, 800, 'Scoreboard2');
        break;
      }
      case 3 : {
        scoreBoard = Nakama.game.add.image(0, 800, 'Scoreboard3');
        break;
      }
      case 4 : {
        scoreBoard = Nakama.game.add.image(0, 800, 'Scoreboard4');
        break;
      }
      case 5 : {
        scoreBoard = Nakama.game.add.image(0, 800, 'Scoreboard5');
        break;
      }
      default : scoreBoard = Nakama.game.add.image(0, 800, 'Scoreboard0');
    }
  }
  scoreBoard.scale.setTo(0.3,0.3);
  console.log(Nakama.chicken[0].sprite.health);
  Nakama.game.add.text(140 , 862, Math.round(Nakama.score), {
    fontSize : '30px',
    fontWeight : 'bold'});

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

  //run background
  Nakama.background.tilePosition.y += 1;

  //randomLines
  if (Nakama.linesGroup.children[Nakama.linesGroup.children.length - 1].position.y >= Nakama.linesGroup.children[Nakama.linesGroup.children.length - 1].height/2 - 20) {
    randomLines();
  }

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
  Nakama.timeToSpawnAnEnemy += Nakama.game.time.physicsElapsed;
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
  if(Nakama.chicken.alive && Nakama.enemyLaser.length != undefined){
    for(var i = 0; i < Nakama.chicken.length; i++){
      for(var j = 0; j < Nakama.enemyLaser.length; j++){
          if(checkOverlap(Nakama.enemyLaser[j].sprite,Nakama.chicken[i].sprite))
            Nakama.chicken[i].damage();
        }
    }
  }

  Nakama.game.physics.arcade.overlap(Nakama.bulletGroup,
    Nakama.chickenGroup,
    onBulletHitChicken);

    if(!Nakama.chicken[0].sprite.alive) {
      if(Nakama.score > Nakama.highScore) Nakama.highScore = Nakama.score;
      var gameOver = Nakama.game.add.image(480 , 380, 'gameOver');
      Nakama.game.world.bringToTop(gameOver);
      gameOver.anchor.set(0.5);
      var restart = Nakama.game.add.image(480, 580, 'restart')
      restart.anchor.set(0.5);
      if(Nakama.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        Nakama.game.state.restart();
    }
}

// before camera render (mostly for debug)
var render = function(){
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
  var lineID = Math.floor(Math.random() * 13);
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
    case 8:
      Nakama.block.push(new GrowingBlockControllerType1(-160, {timeExists: 6}));
      break;
    case 9:
      // Nakama.block.push(new MovingBlockType1Controller(-54, 1, {tweenTime: 3, timeDelay: 2, minX : 200, maxX: 700}));
      // break;
    case 10:
      // Nakama.block.push(new MovingBlockType2Controller(-161, {tweenTime: 3, minY: 200, maxY: 600}));
      // break;
    case 11:
      Nakama.block.push(new SpinningBlockType2Controller(-161))
      break;
    case 12:
      Nakama.block.push(new SpinningBlockType1Controller(-161))
      break;
  }
}
