function File(id, frames) {
    this.previewloaded = false;
    this.loaded = false;
    this.id = id;

    this.__frames = [ ];
    this.__preview = [ ];

    if (frames) {
        this.setFrames(frames);
        this.setPreview(frames[0]);
    }
};

File.prototype.setPreview = function(preview){
    this.__preview = preview;
    this.previewloaded = true;
};

File.prototype.setFrames = function(frames) {
    this.__frames = frames;
    this.loaded = true;
}

File.prototype.frames = function(cb) {
    cb = cb || $.noop;
    var that = this;

    if (that.loaded) {
        cb(that.__frames);
        return;
    }

    $.post("/frames", { id : that.id }, function(resp) {
        that.setFrames(resp);
        cb(that.__frames);
    });
};

File.prototype.preview = function(cb) {
    var that = this;
    cb = cb || $.noop;

    if (that.previewloaded) {
        cb(that.__preview);
        return;
    }

    $.post("/preview", { id : this.id }, function(resp) {
        that.setPreview(resp);
        cb(this.__preview);
    });
};

File.prototype.sync = function(cb) {
    var ajax = $.post("add", { frames: JSON.stringify(frames), id: this.id });

    ajax.always(function(resp) {
        cb(resp);
    })
};


// FileStore is a module for handling in memory or localStorage Files
// This should also be able to handle loading files in from the server
// (either just a preview for a single frame or the whole file).
var _filestore = [];
var FileStore = {

    get: function() {
        return _filestore;
        // return Store.get("files") || [];
    },
    getByID: function(id) {
        return _.filter(FileStore.get(), function(f) {
            return id == f.id;
        })[0] || { };
    },
    push: function(file) {
        _filestore.push(file);
        // var files = FileStore.get();
        // console.log(file);
        // files.push(file);
        // Store.set("files", files);
    },
    clear: function() {
        _filestore = [ ];
        // Store.set("files", []);
    }
};