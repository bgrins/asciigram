var mongoose = require('mongoose');
var db = db;


var frameSchema = new mongoose.Schema({
    content: String,
    timestamp: Date
});

var fileschema = new mongoose.Schema({
    lookup: String,
	numberOfViews: Number,
    frames: [ frameSchema ]
});

var File = mongoose.model("File", fileschema);
var Frame = mongoose.model("Frame", frameSchema);

File.prototype.addFrame = function(content, timestamp) {
    var frame = new Frame();
    frame.content = content;
    frame.timestamp = timestamp || Date.now();
    this.frames.push(frame);
};

File.prototype.getPreview = function() {
    if (this.frames.length > 0) {
        return this.frames[0].content;
    }

    return "";
};

File.prototype.generateLookup = function() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }

    return randomstring;
};

function getFile(lookup, cb){
    File.findOne({ lookup: lookup }, function(err, doc) {
        cb(err, doc);
    });
};

function updateViewCount(doc){ 
	doc.numberOfViews = (doc.numberOfViews || 0)+1;
	doc.save();
};

function getPopular(cb){
	var query = File.find().sort('-numberOfViews').limit(12).where();

	query.exec(function(err, doc) {
        cb(err, doc);
    });
};

exports.File = File;
exports.getFile = getFile;
exports.updateViewCount = updateViewCount;
exports.getPopular = getPopular;
