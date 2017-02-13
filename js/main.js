var Nakama = {};
Nakama.configs = {};

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
  Nakama.game.load.image('gray_background', 'Assets/gray_background.png');
  Nakama.game.load.image('pink_background', 'Assets/pink_background.png');

}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;

  Nakama.backgroundLeft = Nakama.game.add.tileSprite(0, 0, 320, 960, "gray_background");
  Nakama.backgroundRight = Nakama.game.add.tileSprite(320, 0, 320, 960, "pink_background");

  Nakama.graph = Nakama.game.add.graphics(Nakama.game.width/2, 0);
  Nakama.graph.lineStyle(5, 0xECEFF1);
  Nakama.graph.lineTo(0, Nakama.game.height);
}

// update game state each frame
var update = function(){
  Nakama.backgroundLeft.tilePosition.y += 1;
  Nakama.backgroundRight.tilePosition.y += 1;
}

// before camera render (mostly for debug)
var render = function(){}
