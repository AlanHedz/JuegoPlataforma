function Moneda(x,y)
{
	Kinetic.Circle.call(this);
	this.setWidth(30);
	this.setHeight(30);
	this.setX(x);
	this.setY(y);
	this.setFill('yellow');
}
Moneda.prototype = Object.create(Kinetic.Circle.prototype);