// FrameBuffer is a module for storing frame content.
// Handles auto timestamping.
var FrameBuffer = {
    _frames: [],
    currentSize: 0,
    FPS: 15,
    MAX: 50,
    set: function(content) {
        FrameBuffer.clear();
        FrameBuffer.add(content);
    },
    add: function(content) {

        var now = Date.now();

        if (FrameBuffer._frames.length) {
            var lastTime = FrameBuffer._frames[FrameBuffer._frames.length -1].timestamp;

            var ms = now - lastTime;

            // Drop a frame if it is too soon
            if (ms < (1000 / FrameBuffer.FPS)) {
                return;
            }
        }

        if (FrameBuffer._frames.length >= FrameBuffer.MAX) {
            FrameBuffer._frames.shift();
        }

        FrameBuffer._frames.push({
            content: content,
            timestamp: now
        });

        if (window.DEVELOPMENT) {
            $("#num-frames").text(FrameBuffer._frames.length);

            var size = FrameBuffer.getFullSize();

            $("#size-frames").text(util.prettyFileSize(size));
        }
    },
    getFrameSize: function(frame) {
        return util.stringToBytes(frame.content);
    },
    getFullSize: function() {
        var size = 0;
        var fullStr = _.each(FrameBuffer._frames, function(f) {
            size += FrameBuffer.getFrameSize(f);
        });
        return size;
    },
    clear: function() {
        FrameBuffer._frames = [];
        FrameBuffer.currentSize = 0;
    },
    get: function() {
        return FrameBuffer._frames;
    }
};

// Special case on home page: Kick off the app.
if (window.APP) {
    var App = new AppView({ el: $("body") });
}

