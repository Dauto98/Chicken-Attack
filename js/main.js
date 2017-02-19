var Nakama = {};
Nakama.configs = {
  chickenHealth       : 5,
  enemyType1Speed     : 100,
  enemyType2Speed     : 100,
  enemyBulletSpeed    : 500,
  enemyBulletCooldown : 0.4,
  timeToSpawnAnEnemy  : 5,
  obstaclesCooldown   : 5,
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
  Nakama.game.load.image('starting', 'Assets/starting.png');
  Nakama.game.load.atlasJSONHash('sheet1', 'Assets/Map.png', 'Assets/Map.json');
  Nakama.game.load.atlasJSONHash('sheet2', 'Assets/Block.png', 'Assets/Block.json');
  Nakama.game.load.atlasJSONHash('sheet3', 'Assets/Line.png', 'Assets/Line.json');
  Nakama.game.load.spritesheet('chicken', 'Assets/chicken3.png', 117, 155);
  Nakama.game.load.image('Block2', 'Assets/Block2.png');
  Nakama.game.load.image('healthBar1', 'Assets/healthdemo1.png');
  Nakama.game.load.image('healthBar2', 'Assets/healthdemo2.png');
  Nakama.game.load.image('healthBar3', 'Assets/healthdemo3.png');
  Nakama.game.load.image('healthBar4', 'Assets/healthdemo4.png');
  Nakama.game.load.image('healthBar5', 'Assets/healthdemo5.png');
  Nakama.game.load.image('healthBar0', 'Assets/healthdemo0.png');
  Nakama.game.load.image('score', 'Assets/score.png');
  Nakama.game.load.image('gameOver1', 'Assets/gameOver1.png');
  Nakama.game.load.image('gameOver2', 'Assets/gameOver2.png');
  Nakama.game.load.image('gameOver3', 'Assets/gameOver3.png');
  Nakama.game.load.image('gameOver4', 'Assets/gameOver4.png');
  Nakama.game.load.image('restart','Assets/restart.png');
  Nakama.game.load.audio('chickenAttack', 'Assets/chicken-attack.mp3');
  Nakama.game.load.audio('chickenSound', 'Assets/chicken-sound.mp3');
}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;
  Nakama.game.input.activePointer.x = Nakama.game.world.width/2;
  Nakama.game.input.activePointer.y = Nakama.game.world.height/2;
  Nakama.backgroundMusic = Nakama.game.add.audio('chickenAttack');
  Nakama.backgroundMusic.volume = 0.4;
  Nakama.backgroundMusic.loop = true;
  Nakama.backgroundMusic.play();
  Nakama.chickenSound = Nakama.game.add.audio('chickenSound');

  Nakama.background = Nakama.game.add.tileSprite(0, 0,
      Nakama.game.world.width, Nakama.game.world.height, "sheet1", "Map3.png");

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
  Nakama.healthBar = Nakama.game.add.image(0,0,'healthBar5');
  Nakama.scoreBar = Nakama.game.add.image(780,-10,'score');
  Nakama.scoreDisplay = Nakama.game.add.text(860, 70, 0, {
    fontSize : '30px',
    fontFamily  : 'Helvetica'
  });
  Nakama.gameOver = Nakama.game.add.image(480 , 380, 'gameOver1');
  Nakama.gameOver.visible = false;
  Nakama.restart = Nakama.game.add.image(480, 580, 'restart');
  Nakama.restart.visible = false;

  new Lines_longStraight(Nakama.game.world.width/2, Nakama.leftlinesGroup);
}

// update game state each frame
var update = function(){
  //bring the chicken sprite on top of others.
  Nakama.game.world.bringToTop(Nakama.chickenGroup);

  if(Nakama.chicken[0].sprite.alive){
    Nakama.timeToSpawnAnEnemy += Nakama.game.time.physicsElapsed;
    Nakama.score += Nakama.game.time.physicsElapsed;
    //randomly create an enemy between type 1 and type 2 after each ... seconds.
    if(Nakama.timeToSpawnAnEnemy >= Nakama.configs.timeToSpawnAnEnemy) {
      if(Math.round(Math.random())>=0.5){
        //random position.y and directionType for this enemy.
        Nakama.enemies.push(new EnemyType1Controller(
          Nakama.game.world.width - 20,
          Math.round(Math.random()*600 + 100),
          Math.round(Math.random()+1)));
        Nakama.timeToSpawnAnEnemy = 0;
      }
      else{
        //random position.x and directionType for this enemy.
        Nakama.enemies.push(new EnemyType2Controller(
          20,
          Math.round(Math.random()*600 + 100),
          Math.round(Math.random()+1)));
        Nakama.timeToSpawnAnEnemy = 0;
      }
    }
  }

  else {
    Nakama.score += 0;
    if(Nakama.score > Nakama.highScore) Nakama.highScore = Nakama.score;
    Nakama.gameOver.visible = true;
    Nakama.restart.visible = true;
    switch(Math.floor(Nakama.score)%4){
      case 0:  Nakama.gameOver.loadTexture('gameOver1',0);
               break;
      case 1:  Nakama.gameOver.loadTexture('gameOver2',0);
               break;
      case 2:  Nakama.gameOver.loadTexture('gameOver3',0);
               break;
      case 3:  Nakama.gameOver.loadTexture('gameOver4',0);
               break;
   }
    Nakama.gameOver.anchor.set(0.5);
    Nakama.restart.anchor.set(0.5);
    if(Nakama.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      Nakama.backgroundMusic.destroy();
      Nakama.game.state.restart();
    }
  }

  switch(Nakama.chicken[0].sprite.health){
      case 1 : {
        Nakama.healthBar.loadTexture('healthBar1',0);
        break;
      }
      case 2 : {
        Nakama.healthBar.loadTexture('healthBar2',0);
        break;
      }
      case 3 : {
        Nakama.healthBar.loadTexture('healthBar3',0);
        break;
      }
      case 4 : {
        Nakama.healthBar.loadTexture('healthBar4',0);
        break;
      }
      case 5 : {
        Nakama.healthBar.loadTexture('healthBar5',0);
        break;
      }
      default : {
        Nakama.healthBar.loadTexture('healthBar0',0);
      }
  }
  Nakama.healthBar.scale.setTo(0.22,0.22);
  Nakama.scoreBar.scale.setTo(0.22,0.22);
  Nakama.scoreDisplay.setText(Math.round(Nakama.score));
  //Cheat code 500,000 health
  if(Nakama.keyboard.isDown(Phaser.Keyboard.Q)) {
    if(Nakama.keyboard.isDown(Phaser.Keyboard.W)){
      if(Nakama.keyboard.isDown(Phaser.Keyboard.E)){
        if(Nakama.keyboard.isDown(Phaser.Keyboard.R)){
          Nakama.chicken[0].sprite.health = 500000;
    }}}}

  //run background
  Nakama.background.tilePosition.y += 1;
  var a = Nakama.linesGroup.children.length;
  if (Nakama.linesGroup.children[a - 1].position.y >=
          Nakama.linesGroup.children[a - 1].height/2 - 10) {
    randomLines();
  }

  Nakama.chicken[0].update();

  var b = Nakama.block.length;
  for(var i = 0; i < b; i++){
    Nakama.block[i].update();
  }

  var c = Nakama.enemies.length;
  for(var i = 0; i < c; i++){
    Nakama.enemies[i].update();
  }

  var d = Nakama.enemyLaser.length;
  for(var i = 0; i < d; i++){
    Nakama.enemyLaser[i].update();
  }
  //check overlap for every sprite in 2 array Chicken and EnemyLaser
  if(Nakama.chicken.alive && d != undefined){
      for(var j = 0; j < d; j++){
          if(checkOverlap(Nakama.enemyLaser[j].sprite,Nakama.chicken[0].sprite))
            Nakama.chicken[0].damage();
        }
    }

  Nakama.game.physics.arcade.overlap(Nakama.bulletGroup,
    Nakama.chickenGroup,
    onBulletHitChicken);
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
       Nakama.block.push(new MovingBlockType1Controller(-54,
         Math.round(Math.random()+1),
         {tweenTime: 1, minX : 280, maxX: 680, timeDelay : 1}));
       break;
    case 10:
      Nakama.block.push(new SpinningBlockType2Controller(-161));
      break;
    case 11:
      Nakama.block.push(new SpinningBlockType1Controller(-161));
      break;
  }
}
