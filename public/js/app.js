
// FileStore is a module for handling in memory or localStorage Files
// This should also be able to handle loading files in from the server
// (either just a preview for a single frame or the whole file).
var FileStore = {
    get: function() {
        return Store.get("files") || [];
    },
    getByID: function(id) {
        return _.filter(FileStore.get(), function(f) {
            return id == f.id;
        })[0] || { };
    },
    push: function(file) {
        var files = FileStore.get();
        files.push(file);
        Store.set("files", files);
    },
    clear: function() {
        Store.set("files", []);
    }
};

// FrameBuffer is a module for storing frame content.
// Handles auto timestamping.
var FrameBuffer = {
    _frames: [],
    set: function(content) {
        FrameBuffer.clear();
        FrameBuffer.add(content);
    },
    add: function(content) {
        FrameBuffer._frames.push({
            content: content,
            timestamp: Date.now()
        });

        if (window.DEVELOPMENT) {
            $("#num-frames").text(FrameBuffer._frames.length);

            var size = 0;
            _.each(FrameBuffer._frames, function(f) {
                size += f.content.length;
            });
            log($("#size-frames"));
            $("#size-frames").text(size + "MB");
        }
    },
    clear: function() {
        FrameBuffer._frames = [];
    },
    get: function() {
        return FrameBuffer._frames;
    }
};

// Special case on home page: Kick off the app.
if (window.APP) {
    var App = new AppView({ el: $("body") });
}

