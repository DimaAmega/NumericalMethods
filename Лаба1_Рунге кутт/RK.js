;(function () {
	var RungKut = function(Fxy,t,Vec,h) {
		var k1,k2,k3,k4;
		k1 = Fxy(t,Vec);
        k2 = Fxy(t,Vec.add(k1.onscalar(h/2)));
        k3 = Fxy(t,Vec.add(k2.onscalar(h/2)));
        k4 = Fxy(t,Vec.add(k3.onscalar(h)));
        return new Vec2(Vec.add(k1.add(k2.onscalar(2).add(k3.onscalar(2)).add(k4)).onscalar(h/6)));
	}
	window.RungeKutt = RungKut;
}())