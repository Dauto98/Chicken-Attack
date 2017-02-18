class LineController {
	constructor(x, key, spriteName, linesGroup, anchor){
		this.sprite = linesGroup.create(x, -480, key, spriteName);
		this.sprite.anchor = anchor;
		this.sprite.body.velocity.y = Nakama.configs.linesSpeed;
		this.sprite.scale.setTo(0.48, 0.48);
	}
}
