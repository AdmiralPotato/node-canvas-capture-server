var CanvasCapture = function(canvas){
	var t = this, type = 'CanvasCapture';
	if(t.type !== type){
		throw new Error(type + ' constructor must be invoked using the `new` keyword.');
	}
	t.canvas = canvas;
	t.frameList = [];
};

CanvasCapture.prototype = {
	type: 'CanvasCapture',
	capture: function(){
		var t = this;
		t.frameList.push(t.canvas.toDataURL('image/png'));
	},
	send: function(path){
		var t = this;
		$.post(
			'/capture',
			{
				frameList: t.frameList,
				path: path || '0'
			},
			function(reply){
				alert(reply);
			}
		);
	}
};