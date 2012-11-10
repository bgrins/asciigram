var mongoose = require('mongoose');
var db = db;

var schema = new mongoose.Schema({
    content: String,
    timestamp: { type: Date, default: Date.now },
    lookup: String
});

var File = mongoose.model("File", schema)

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

exports.File = File;
exports.getFile = getFile;