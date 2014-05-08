//This is the simplest way to pull down jQuery I could think up,
//without expecting the user to have bower installed globally.
//I probably just need to read its docs better.
var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	download = function(url, dest, cb) {
		var file = fs.createWriteStream(dest);
		http.get(url, function(response) {
			response.pipe(file);
			file.on('finish', function() {
				file.close(cb);
			});
		});
	},
	requestMap = {
		"public/javascripts/jquery-2.1.1.js": "http://code.jquery.com/jquery-2.1.1.js"
		//you can add additional libraries here if you wanna
	},
	pathName, url, destination;

for(pathName in requestMap){
	if(requestMap.hasOwnProperty(pathName)){
		url = requestMap[pathName];
		destination = pathName.split('/').join(path.sep);
		download(
			url,
			destination,
			function(){
				var u = url;
				return function(){ console.log( u + ' downloaded successfully');}
			}()
		);
	}
}