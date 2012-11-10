var fileStore = require("../models/file.js");

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.add = function(req, res) {
	var file = new fileStore.File();
	file.content = req.body.content;
	file.lookup = file.generateLookup();
	file.save(function(err) {
		if (err) { 
			res.end("oops"); 
		}

		return res.send(file.lookup);
	});
};

exports.get = function(req, res) {
	var lookup = req.params.id;
	fileStore.getFile(lookup, function(err, file) {
		if (err || !file) {
			res.send("Not found", 404);
			return;
		}

		res.send(file.content);
	});
};