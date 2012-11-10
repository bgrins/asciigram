var fileStore = require("../models/file.js");

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.add = function(req, res) {
	var id = req.body.id;
	var frames = JSON.parse(req.body.frames);
	if (id) {
		fileStore.getFile(id, function(err, file) {
			if (err || !file) {
				res.send("Not found", 404);
				return;
			}
			
			updateFile(file);			
		});
	}
	else {
		var file = new fileStore.File();
		file.lookup = file.generateLookup();
		updateFile(file);
	}

	function updateFile(file) {
		frames.forEach(function(frame) {
			file.addFrame(frame.content, frame.timestamp);
		});

		file.save(function(err) {
			if (err) { 
				res.end("oops", 500); 
			}

			return res.send(file.lookup);
		});
	}
};

exports.get = function(req, res) {
	var lookup = req.params.id;
	fileStore.getFile(lookup, function(err, file) {
		if (err || !file) {
			res.send("Not found", 404);
			return;
		}

		res.send(file.frames[0].content);
	});
};