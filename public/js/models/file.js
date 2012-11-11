
function Frame(obj) {
    this.content = obj.content.replace(/&nbsp;/g, " ").replace(/<br>/g, "\n");
    this.timestamp = new Date(obj.timestamp).getTime();
    this.date = new Date(this.timestamp);
}

function FilePlayer(file, player, cb) {
    var filePlayer = this;

    this.playing = false;
    this.player = player || document.createElement("pre");
    this.ontick = function() { };
    this.onfinish = function() { };

    file.preview(function(preview) {
        if (!filePlayer.frames) {
            filePlayer.player.textContent = preview.content;
        }
    });

    file.frames(function(frames) {
        filePlayer.frames = frames;
        filePlayer.isImage = frames.length === 1;
        cb(filePlayer);
    });

}

FilePlayer.prototype.play = function(startFrame) {
    var player = this.player;
    if (this.isImage) {
        player.textContent = this.frames[0].content;
        return;
    }

    if (this.playing) {
        return;
    }

    this.playing = true;

    var vid = this;
    var REFRESH_RATE = 50;
    var speed = 1;

    startFrame = Math.min(this.frames.length - 1, Math.max(startFrame, 0)) || 0;

    var startTime = (new Date()).getTime();
    var currentTime = startTime - this.frames[startFrame].timestamp;
    var currentTimeOffset = startTime - this.frames[0].timestamp;
    var timeShift = currentTimeOffset - currentTime;


    vid.ticks = startFrame;

    var frames = this.frames;

    function findFrame(time) {

        time = time + timeShift;
        for (var i = 0; i < frames.length; i++) {

            //log(frames[i].timestamp, time);
            if (frames[i].timestamp > time) {
                return {
                    frame: frames[i],
                    index: i,
                    last: i === frames.length - 1
                };
            }
        }
    }

    function play() {
        // If it has been stopped, bail out.
        if (!vid.playing) {
            return;
        }

        currentTime = (new Date()).getTime() - currentTimeOffset;
        var currentFrame = findFrame(currentTime);

        // Finished the video... stop it
        if (!currentFrame) {
            vid.stop();
            return;
        }

        var currentContent = currentFrame.frame.content;

        vid.playing = true;
        vid.ticks++;
        $("#num-ticks").text(vid.ticks);

        vid.setFrame(currentFrame.index);

        if (currentFrame.last) {
            vid.pause();
            vid.currentFrame = 0;
            vid.onfinish();
        }
        else {
            setTimeout(play, REFRESH_RATE);
        }
    }

    play();
};

FilePlayer.prototype.getLength = function() {
    if (this.isImage) {
        return 0;
    }

    return this.frames.length;
};

FilePlayer.prototype.setFrame = function(i) {
    var index = Math.min(this.frames.length - 1, Math.max(i, 0)) || 0;
    var frame = this.frames[index];

    //log(index, frame);
    if (frame) {

        this.currentFrame = index;
        this.player.textContent = frame.content;

        this.ontick(frame.timestamp);
    }
};

FilePlayer.prototype.pause = function() {
    this.playing = false;
};
FilePlayer.prototype.stop = function() {
    this.ticks = 0;
    this.currentFrame = 0;
    this.setFrame(0);
    this.playing = false;
};

// get the x/y resolution of the first frame
FilePlayer.prototype.getResolution = function() {
    var frame = this.__frames[0];
    var lines = frames.split("/n");
    return [ lines[0].length, lines.length ];
};



function File(id, frames, player) {
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
    var frames = _.map(frames, function(frame) {
        return new Frame(frame);
    });

    this.__frames = _.sortBy(frames, function(f) {
        return f.date;
    });

    this.loaded = true;
};

File.prototype.frames = function(cb) {
    cb = cb || $.noop;
    var that = this;

    if (that.loaded) {
        cb(that.__frames);
        return;
    }

    $.get("/frames/" + this.id, function(resp) {
        that.setFrames(resp.frames);
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
        file.synced = true;
        FileStore.savePermanent(file);
        cb(resp);
    })
};

File.prototype.getShareUrl = function() {
    if (!this.synced) {
        return "";
    }
    return "/view/" + this.id;
}

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
    var file = new File(i);
    file.synced = true;
    FileStore.push(file);
});
