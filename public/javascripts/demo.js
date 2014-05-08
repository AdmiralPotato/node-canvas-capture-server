//Scroll down to the bottom of this file to see how to use the CanvasCapture object.
var myCanvas = document.getElementById("outputCanvas"),
	ctx = myCanvas.getContext('2d'),
	w = myCanvas.width,
	h = myCanvas.height,
	cx = Math.round(w / 2),
	cy = Math.round(h / 2),
	tau = Math.PI * 2,
	deg = Math.PI / 180,
	cos = Math.cos,
	sin = Math.sin,
	drawNGon = function(pos, radius, points, offset, color){
		var angle = tau / points,
			angularOffset = offset || 0,
			strokeColor = color || "#fff";
		ctx.save();
		ctx.translate(pos[0], pos[1]);
		ctx.beginPath();
		ctx.strokeStyle = strokeColor;
		ctx.moveTo(
			cos(angularOffset) * radius,
			sin(angularOffset) * radius
		);
		for(var i = 1; i < points; i += 1){
			ctx.lineTo(
				cos(angle * i + angularOffset) * radius,
				sin(angle * i + angularOffset) * radius
			);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	},
	frame = 0,
	position = [0,0],
	radius = 80,
	getHslaString = function(h, s, l, a){
		return 'hsla(' + h + ', '+ s +'%, '+ l +'%, '+ a +')';
	},
	render = function(){
		//These are the mechanics of what is rendered each frame;
		//Not relevant to how the CanvasCapture object works,
		//but it's better to have something pretty in a demo.
		ctx.save();
		ctx.fillStyle = getHslaString(0,0,0,0.125);
		ctx.fillRect(0,0,w,h);
		ctx.translate(cx, cy);

		position[0] = cos(frame * 10 * deg) * -radius;
		position[1] = sin(frame * 10 * deg) * radius;

		ctx.lineWidth = 8;
		drawNGon(
			position,
			radius,
			3,
			frame * 10 * deg,
			getHslaString(frame * 10, 100, 50, 0.25)
		);
		ctx.lineWidth = 4;
		drawNGon(
			position,
			radius,
			3,
			frame * 10 * deg,
			getHslaString(frame * 10, 100, 50, 0.5)
		);
		ctx.lineWidth = 2;
		drawNGon(
			position,
			radius,
			3,
			frame * 10 * deg,
			getHslaString(frame * 10, 100, 50, 1)
		);

		frame++;

		ctx.restore();
	};


//What really matters is getting access to the HTMLCanvas element,
//then passing it on to the CanvasCapture constructor.
var myCanvasCapture = new CanvasCapture(myCanvas),
	//I leave `exportMode` false when I am playing with the visual design
	exportMode = true,
	update = function(){
		render();
		if(exportMode){
			//I start capturing at a later frame in this design because it needs to build up the canvas
			//content before I start capture so that the output animation will loop well.
			if(frame > 36 && frame < 72){
				//Any time you have a frame rendered and ready for capture, use this.
				myCanvasCapture.capture();
			} else if(frame >= 72) {
				clearInterval(interval);
				//When you are done capturing all of the frames in the animation,
				//this function sends them all to the server in one large lump.
				myCanvasCapture.send('index_output_0');
			}
		}
	},
	interval = setInterval(update, 1000 / 30);