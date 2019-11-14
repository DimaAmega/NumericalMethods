;(function () {
	function Vec2(x = 0,y = 0) {
		if(typeof(x)=="object") {
			this.x = x.x;
			this.y = x.y;
		} else {
		this.x = x;
		this.y = y;
		}
		this.add = function(Vec){
			return new Vec2(this.x+Vec.x,this.y+Vec.y);
		};
		this.onscalar = function(scalar) {
			return new Vec2(this.x*scalar,this.y*scalar);
		};
		this.sub = function(Vec) {
			return new Vec2(this.x-Vec.x,this.y-Vec.y);
		};
		this.length = function() {
			return Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2), 0.5);
		};
		this.toString = function() { return "x: " + this.x + "<br>" +"y : " + this.y+ "<br>"};
	}
	window.Vec2 = Vec2;
}())