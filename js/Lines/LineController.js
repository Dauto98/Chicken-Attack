class LineController {
	constructor(x, spriteName, linesGroup, anchor){
		this.straghtLine = linesGroup.create(x, -480, spriteName);
		this.straghtLine.anchor = anchor;
		this.straghtLine.body.velocity.y = Nakama.configs.linesSpeed;
	}
}
