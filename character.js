export default class Character {

    	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
//		this.isOnPlatForm = false;
	}

    draw() {
        rect(this.x, this.y, this.w, this.h);
    }

    isColliding(character, platform) {
    if (platform.y === character.y + character.w && platform.x <= character.x + character.w) {
        return true;
    } else {
        return false;
    }
}
}