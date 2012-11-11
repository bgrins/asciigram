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

    $.get("/preview/" + this.id, function(resp) {
        that.setPreview(new Frame({ timestamp: new Date(), content: resp }));
        cb(that.__preview);
    });
};

File.prototype.sync = function(cb) {
    cb = ($.isFunction(cb)) ? cb : $.noop;
    var file = this;
    var frames = file.__frames;
    var id = file.id;
    var ajax = $.post("/add", { frames: JSON.stringify(frames), id: id });
    ajax.always(function(resp) {
        file.id = resp;
        FileStore.savePermanent(file);
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
    },
    getByID: function(id) {
        return _.filter(FileStore.get(), function(f) {
            return id == f.id;
        })[0] || { };
    },
    push: function(file) {
        _filestore.push(file);
    },
    savePermanent: function(file) {
        var store = Store.get("previous-files") || [ ];
        store.push(file.id);
        Store.set("previous-files", store);
    },
    clear: function() {
        _filestore = [ ];
    }
};

var savedStore = Store.get("previous-files") || [];
_.each(savedStore, function(i) {
    FileStore.push(new File(i));
});
