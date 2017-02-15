var Nakama = {};
Nakama.configs = {
  keyboard : {
    up    : Phaser.Keyboard.UP,
    down  : Phaser.Keyboard.DOWN,
    left  : Phaser.Keyboard.LEFT,
    right : Phaser.Keyboard.RIGHT
  },
  chickenHealth : 5,
  enemySpeed    : 30,
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
  Nakama.blockGroup = Nakama.game.add.physicsGroup();
  Nakama.enemyGroup = Nakama.game.add.physicsGroup();
  Nakama.laserGroup = Nakama.game.add.physicsGroup();
  Nakama.chicken = [];
  Nakama.enemies = [];
  Nakama.enemyLaser = [];
  Nakama.block = [];
  Nakama.chicken.push(new ChickenController(300,800,
    {
      chickenSpeed : 300
    }));
  Nakama.timeToSpawnAnEnemy = 0;
  Nakama.block.push(new SpinningBlockType1Controller(300,300));
  Nakama.block.push(new SpinningBlockType2Controller(300,600));
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

  if(Nakama.timeToSpawnAnEnemy >= 5) {
    Nakama.enemies.push(new EnemyController(
    620, Math.floor(Math.random()*600 + 100),
    Math.floor(Math.random()+1)
    ));
    Nakama.timeToSpawnAnEnemy = 0;
  }
}

// before camera render (mostly for debug)
var render = function(){}
