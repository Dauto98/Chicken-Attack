var Nakama = {};
Nakama.configs = {
  linesSpeed : 500
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
  Nakama.game.load.image('gray_background', 'Assets/gray_background.png');
  Nakama.game.load.image('red_background', 'Assets/red_background.png');
  Nakama.game.load.image('straght_line', 'Assets/main_line.png');
  Nakama.game.load.image('hole_line', 'Assets/line1.png');
  Nakama.game.load.image('thin_line', 'Assets/thin_line.png');
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

  Nakama.leftLinesGroup = Nakama.game.add.physicsGroup();
  Nakama.rightLinesGroup = Nakama.game.add.physicsGroup();

  new Lines_longStraight(160, Nakama.leftLinesGroup);
  new Lines_longStraight(480, Nakama.rightLinesGroup);
}

// update game state each frame
var update = function(){
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
}
