// FrameBuffer is a module for storing frame content.
// Handles auto timestamping.
var FrameBuffer = {
    _frames: [],
    FPS: 15,
    MAX: 200,
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

