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
  Nakama.game.load.image('red_background', 'Assets/red_background.png');
  Nakama.game.load.image('straght_line', 'Assets/main_line.png');
  Nakama.game.load.image('hole_line', 'Assets/line1.png');
}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;

  Nakama.backgroundLeft = Nakama.game.add.tileSprite(0, 0, 320, 960, "gray_background");
  Nakama.backgroundRight = Nakama.game.add.tileSprite(320, 0, 320, 960, "red_background");

  Nakama.graph = Nakama.game.add.graphics(Nakama.game.width/2, 0);
  Nakama.graph.lineStyle(5, 0xECEFF1);
  Nakama.graph.lineTo(0, Nakama.game.height);

  Nakama.linesGroup = Nakama.game.add.physicsGroup();

  Nakama.straghtLine = Nakama.linesGroup.create(160, -480, 'straght_line');
  Nakama.straghtLine.anchor = new Phaser.Point(0.5, 0.5);
  Nakama.straghtLine.body.velocity.y = 300;

  Nakama.holeLine = Nakama.linesGroup.create(160, -480, 'hole_line');
  Nakama.holeLine.anchor = new Phaser.Point(0.5, 0.5);

  Nakama.set = false;
}

// update game state each frame
var update = function(){
  Nakama.backgroundLeft.tilePosition.y += 1;
  Nakama.backgroundRight.tilePosition.y += 1;

  if (Nakama.set === false) {
    if (Nakama.straghtLine.position.y >= Nakama.straghtLine.height/2) {
      Nakama.holeLine.position.x = Nakama.straghtLine.position.x;
      Nakama.holeLine.position.y = Nakama.straghtLine.position.y - (Nakama.holeLine.height + Nakama.straghtLine.height)/2;
      Nakama.holeLine.body.velocity.y = 300;
      Nakama.set = true;
    }
  }

}

// before camera render (mostly for debug)
var render = function(){}
