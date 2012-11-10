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

/*
exports.mongo = function(req, res){
	var schema = mongoose.Schema({ name: 'string' });
	var Cat = db.model('Cat', schema);

	var kitty = new Cat({ name: 'Zildjian' });
	kitty.save(function (err) {
	  if (err) // ...
	  res.end('meow');
	});
	console.log(kitty);


  res.render('index', { title: 'Express' });
};*/
