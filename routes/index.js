var mongoose = require('mongoose');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

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
};
