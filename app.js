var express = require('express'),
	directory = require('serve-index'),
	path = require('path'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	rmdirRecursiveSync = require('rmdir-recursive').sync,
	pad = function(str, max) {
		return str.length < max ? pad("0" + str, max) : str;
	},
	app = express();



app.use(bodyParser.urlencoded({limit: '500mb'}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(directory(path.join(__dirname, 'public')));



app.post('/capture', function(req, res, next){
	var errorMessage = false,
		err,
		outputPath;
	if(!req.body.frameList || !req.body.frameList.length){
		errorMessage = 'Missing or invalid "frameList" parameter';
	}
	else if (!req.body.path) {
		errorMessage = 'Missing or invalid "path" parameter';
	}
	if(errorMessage){
		err = new Error(errorMessage);
		err.status = 503;
		next(err);
	} else {
		outputPath = path.join(__dirname, "output", req.body.path.replace(/\\|\.\.|\//g, path.sep));
		if(fs.existsSync(outputPath)){
			try{
				rmdirRecursiveSync(outputPath);
			} catch(e){
				console.error(
					'Error encountered trying trying to rmdirRecursiveSync this path:\n'+
					outputPath + '\n' +
					'probably because of a locked Thumbs.db file. Resuming normal operation.'
				);
				console.error(e);
			}
		}
		console.log('Saving files to path: ' + outputPath);
		mkdirp.sync(outputPath);
		req.body.frameList.forEach(function(frameData, index){
			var imageDataBuffer = new Buffer(frameData.replace('data:image/png;base64,', ''), 'base64'),
				filePath = path.join(outputPath, pad((index + 1).toString(), 4)+".png");
			//doing this synchronously ensures that when sorting the files by date, they appear in the correct order.
			fs.writeFileSync(filePath, imageDataBuffer, "binary", function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log(filePath + " was saved!");
				}
			});
		});
		res.send('Capture success. Look in "'+ outputPath +'" for your output images.');
	}
});

/// catch 404 and forwarding to error handler
app.use(function(err, req, res, next) {
	console.log(err);
	if(!err){
		err = new Error('Not Found');
		err.status = 404;
	}
	next(err);
});

app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.send(err.message);
});

module.exports = app;
