var fileStore = require("../models/file.js");

exports.index = function(req, res){
  res.render('index', { title: 'Asciigram' });
};

exports.about = function(req, res){
  res.render('about', { title: 'About' });
};

// exports.embed = function(req, res) {
// 	var lookup = req.params.id;
// 	fileStore.getFile(lookup, function(err, file) {
// 		if (err || !file) {
// 			res.send("Not found", 404);
// 			return;
// 		}

// 		res.render("embed", { file: JSON.stringify(file), layout: null});
// 	});
// };

exports.preview = function(req, res) {
	var lookup = req.params.id;
	fileStore.getFile(lookup, function(err, file) {
		if (err || !file) {
			res.send("Not found", 404);
			return;
		}

		res.send(file.getPreview());
	});
};

exports.frames = function(req, res) {
	var lookup = req.params.id;
	fileStore.getFile(lookup, function(err, file) {
		if (err || !file) {
			res.send("Not found", 404);
			return;
		}

		res.send(file);
	});
};

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

exports.popular = function(req, res){
	fileStore.getPopular(function(err, files) {
		if (err || !files) {
			res.send("Not found", 404);
			return;
		}
		for (var i=0; i<files.length; i++){ 
			files[i].frames[0].content = files[i].frames[0].content.replace(/&nbsp;/g, " ").replace(/<br>/g, "\n");
		}		

		res.render("popular", { title: "Asciigram -- Popular", files: files });
	});
};

exports.view = function(req, res) {
	var lookup = req.params.id;
	fileStore.getFile(lookup, function(err, file) {
		if (err || !file) {
			res.send("Not found", 404);
			return;
		}
		
		fileStore.updateViewCount(file);
		res.render("view", { title: "Asciigram -- View", file: JSON.stringify(file), 
			numberOfViews: (file.numberOfViews || 0), loves: (file.loves || 0), hates: (file.hates || 0) });
	});
};

exports.secretDelete = function(req, res) {
	var lookup = req.params.lookup;
	fileStore.secretDelete(lookup);
	res.end();
};

exports.love = function(req, res) {
	var lookup = req.params.lookup;
	fileStore.updateLoves(lookup);
	res.end();
};

exports.hate = function(req, res) {
	var lookup = req.params.lookup;
	fileStore.updateHates(lookup);
	res.end();
};
