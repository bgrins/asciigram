var fileStore = require("../models/file.js");

exports.index = function(req, res){
  res.render('index', { title: 'Asciigram' });
};

exports.about = function(req, res){
  res.render('about', { title: 'About' });
};

exports.embed = function(req, res) {
	var lookup = req.params.id;
	fileStore.getFile(lookup, function(err, file) {
		if (err || !file) {
			res.send("Not found", 404);
			return;
		}

		res.render("embed", { file: JSON.stringify(file), layout: null});
	});
}

exports.add = function(req, res) {
	var id = req.body.id;
	var frames;

	try {
		frames = JSON.parse(req.body.frames);
	} catch(e) {
		res.send("Invalid file data", 500);
	}

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

exports.view = function(req, res) {
	var lookup = req.params.id;
	fileStore.getFile(lookup, function(err, file) {
		if (err || !file) {
			res.send("Not found", 404);
			return;
		}

		res.render("view", { title: "Asciigram -- View", file: JSON.stringify(file) });
	});

}

exports.get = function(req, res) {
	var lookup = req.params.id;
	fileStore.getFile(lookup, function(err, file) {
		if (err || !file || !file.frames || !file.frames.length) {
			res.send("Not found", 404);
			return;
		}

		res.send(file.frames[0].content);
	});
};