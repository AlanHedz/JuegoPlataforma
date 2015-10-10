var stage,fondo,grupoAssets,puntaje;
var keyboard = {};
var intv;
var personaje;
var grav = 0.8;
var val_reb = -0.5;
var juego = new Game();
var imgEn = new Image();


grupoAssets = new Kinetic.Group({
	x: 0,
	y: 0
});

stage = new Kinetic.Stage({
	container: "game",
	width: 960,
	height: 500
});

puntaje = new Kinetic.Text({
	text: 'Puntaje: 0',
	height: 25,
	width: 150,
	x: stage.getWidth()-150,
	y: 0,
	fill: '#222',
	fontFamily: 'Arial',
	fontSize: 20
});

function nivelUno()
{
	juego.puntaje = 0;
	juego.llave = true;
	fondo = new Kinetic.Layer();
	/* Enemigos */
	grupoAssets.add(new Enemigo(200,stage.getHeight()-75));
	grupoAssets.add(new Enemigo(850,stage.getHeight()/3.9-60));
	grupoAssets.add(new Enemigo(170,stage.getHeight()/3-60));
	grupoAssets.add(new Enemigo(1020,stage.getHeight()-75));
	grupoAssets.add(new Enemigo(1120,stage.getHeight()-75));
	grupoAssets.add(new Enemigo(1220,stage.getHeight()-75));

	/*Plataformas*/
	var piso = new Plataforma(0,stage.getHeight()-15);
	piso.setWidth(stage.getWidth()*2);
	grupoAssets.add(piso);
	grupoAssets.add(new Plataforma(20,stage.getHeight()/1.5));
	grupoAssets.add(new Plataforma(190,stage.getHeight()/3));
	grupoAssets.add(new Plataforma(510,stage.getHeight()/1.6));
	grupoAssets.add(new Plataforma(870,stage.getHeight()/3.9));

	/* Moneda */
	grupoAssets.add(new Moneda(350,stage.getHeight()/3-130));
	grupoAssets.add(new Moneda(650,stage.getHeight()/2-130));
	grupoAssets.add(new Moneda(80,stage.getHeight()-80));
	grupoAssets.add(new Moneda(350,stage.getHeight()/3-130));
	grupoAssets.add(new Moneda(910,stage.getHeight()/6));
	grupoAssets.add(new Moneda(1220,stage.getHeight()-80));

	/* Puerta */
	grupoAssets.add(new Puerta(910, stage.getHeight()-85));

	personaje = new Heroe();
	personaje.setX(0);
	personaje.setY(stage.getHeight()-personaje.getHeight());
	personaje.limiteDer = stage.getWidth()-personaje.getWidth();
	personaje.limiteTope = stage.getHeight();
	fondo.add(personaje);
	fondo.add(grupoAssets);
	fondo.add(puntaje);
	stage.add(fondo);
	intv = setInterval(frameLoop,1000/20);
}
function nivelDos()
{
	console.log("Bienbenido al nivel 2");
}
function moverPersonaje()
{
	if(keyboard[37])
	{
		personaje.retroceder();
	}
	if(keyboard[39])
	{
		personaje.caminar();
	}
	if(keyboard[38] && personaje.contador < 1)
	{
		personaje.saltar();
	}
}
function addKeyBoardEvents()
{
	addEvent(document, "keydown", function(e){
		keyboard[e.keyCode] = true;
	});
	addEvent(document, "keyup", function(e){
		keyboard[e.keyCode] = false;
	});
	function addEvent(element,eventName,func)
	{
		if(element.addEventListener)
		{
			element.addEventListener(eventName,func,false);
		}
		else if(element.attachEvent)
		{
			element.attachEvent(eventName,func);
		}
	}
}
function hit(a,b)
{
	var hit = false;
	if(b.getX() + b.getWidth() >= a.getX()  && b.getX() < a.getX() + a.getWidth())
  	{
  		//colisiones verticales
   		if(b.getY() + b.getHeight() >= a.getY() && b.getY() < a.getY() + a.getHeight())
    	hit= true;
  	}

 	//colisiones de a con b
  	if(b.getX() <= a.getX() && b.getX() + b.getWidth() >= a.getX() + a.getWidth() )
  	{
   		if(b.getY() <= a.getY() &&  b.getY() +  b.getHeight() >= a.getY() + a.getHeight())
    	hit= true;
  	}

 	//Colision b con a
  	if(a.getX() <= b.getX() && a.getX() + a.getWidth() >= b.getX() + b.getWidth() )
  	{
   		if(a.getY() <= b.getY() &&  a.getY() +  a.getHeight() >= b.getY() + b.getHeight())
    	hit= true;
  	}
	return hit;
}

function aplicarFuerzas()
{
	personaje.aplicarGravedad(grav, val_reb);
}
function moverEnemigos()
{
	var enemigos = grupoAssets.children;
	for(i in enemigos)
	{
		var enemigo = enemigos[i];
		if(enemigo instanceof Enemigo)
		enemigo.mover();
	}
}


function detectarColPlataformas()
{
	var plataformas = grupoAssets.children;
	for(i in plataformas)
	{
		var plataforma = plataformas[i];
		if(hit(plataforma,personaje))
		{
			if(plataforma instanceof Enemigo)
			{
				if(personaje.vy > 2 && personaje.getY() < plataforma.getY())
				{
					plataforma.remove();
					juego.puntaje += 5;
					console.log(juego.puntaje)

				}
				else
				{
					console.log("Perdistee");
				}
			}
			else if(plataforma instanceof Plataforma 
				&& personaje.getY() < plataforma.getY() && personaje.vy >= 0)
			{
				//Comportamiento
				personaje.contador = 0;
				personaje.setY(plataforma.getY() - personaje.getHeight());
				personaje.vy *= val_reb;
			}
			else if(plataforma instanceof Moneda)
			{
				plataforma.remove();
				juego.puntaje++;
			}
			else if(plataforma instanceof Puerta)
			{
				if(juego.nivel == 1) nivelDos();
				if(juego.nivel == 2) console.log('Ganaste');

			}

		}
	}
}

function actualizarTexto()
{
	puntaje.setText('Puntaje: ' +juego.puntaje);
}

addKeyBoardEvents();
function frameLoop()
{
	aplicarFuerzas();
	actualizarTexto();
	detectarColPlataformas();
	moverPersonaje();
	moverEnemigos();
	stage.draw();
}