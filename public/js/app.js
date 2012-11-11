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
            var fullStr = _.map(FrameBuffer._frames, function(f) {
                size += util.stringToBytes(f.content);
            });

            $("#size-frames").text(util.prettyFileSize(size));
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

