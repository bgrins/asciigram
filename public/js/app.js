var Store = (function() {

    var _store = window.localStorage || { };

    return {
        get: function(key) {
            if (_store[key] != undefined) {
                try {
                    return JSON.parse(_store[key]);
                } catch(e) { }
            }
        },
        set: function(key, val) {
            _store[key] = JSON.stringify(val);
        },
        clear: function() {
            if (window.localStorage && window.localStorage.clear) {
                window.localStorage.clear();
            }
            else {
                _store = {};
            }
        }
    }

})();

log("Stored Files", Store.get("files"));

var FrameBuffer = {
    _frames: [],
    add: function(content) {
        FrameBuffer._frames.push({
            content: content,
            timestamp: Date.now()
        });

        $("#num-frames").text(FrameBuffer._frames.length);
    },
    clear: function() {
        FrameBuffer._frames = [];
    },
    get: function() {
        return FrameBuffer._frames;
    }
};

FrameBuffer.add("1");
setTimeout(function() {
    FrameBuffer.add("2");
}, 100);
setTimeout(function() {
    FrameBuffer.add("3");
}, 200);
setTimeout(function() {
    FrameBuffer.add("4");
}, 400);
setTimeout(function() {
    FrameBuffer.add("5");
}, 600);

var AppView = Backbone.View.extend({

    events: {
        "click #save": "save",
        "click #record": "toggleRecord"
    },

    toggleRecord: function() {
        if (!this.recording) {
            FrameBuffer.clear();
        }
        this.recording = !this.recording;
    },

    getCurrentFrames: function() {
        return FrameBuffer.get();
    },

    save: function() {

        var frames = this.getCurrentFrames();

        if (frames.length == 0) {
            log("Error, no frames provided");
            return;
        }

        var ajax = $.post("add", { frames: JSON.stringify(frames) });

        ajax.done(function(id) {
            var allSaved = Store.get("files") || [];
            allSaved.push({
                id: id,
                frames: frames
            });
            Store.set("files", allSaved);
        });
    },

    initialize: function() {

        this.asciiLogo();

        var that = this;
        Jscii.renderVideo($('#video')[0], $('#videoascii')[0], function() {
            $("body").removeClass("no-video").addClass("yes-video");
            FrameBuffer.clear();
        }, function(markup) {
            if (that.recording) {
                FrameBuffer.add(markup);
            }
        });

        FileReaderJS.setupDrop(document.body, this.fileReaderOpts);
        FileReaderJS.setupClipboard(document.body, this.fileReaderOpts);

    },

    fileReaderOpts: {
        on: {
            load: function(e, file) {
                var img = new Image();

                img.src = e.target.result;
                var container = $("<div class='gram-container'><pre></pre></div>").appendTo("body");

                //$("body").append(img);
                App.asciiImage(img, container.find("pre")[0]);
                log("Loaded", e, file);
            }
        }
    },

    asciiLogo: function() {
        var img = $("#logo");
        var container = $("#imgascii")[0];
        var that = this;

        function onload() {
            that.asciiImage(img[0], container, function() {
                that.GL = new GLView({ image: $("#logo") });
            });
        }

        if (img[0].complete) {
            onload();
        }
        else {
            img.on("load", onload);
        }
    },

    asciiImage: function(image, container, cb) {
        Jscii.renderImage(image, container, cb);
    }

});

var GLView = Backbone.View.extend({

    initialize: function(opts) {
        if (!opts.image) {
            throw "No Image provided";
        }

        this.image = opts.image;

        var that = this;
        if (this.image[0].complete) {
            this.setupGL();
        }
        else {
            this.image.on("load", function() {
                that.setupGL();
            });
        }
    },
    setupGL: function() {

        var image = this.image[0];
        var placeholder = $("#gl-container");
        var asciiContainer= $("#imgascii");

        var asciiWidth = asciiContainer.width();

        $(image).width(asciiWidth);

        try {
            var canvas = fx.canvas();
        }
        catch (e) {
            return;
        }


        $(image).show();

        // Create a texture from the image and draw it to the canvas
        var texture = canvas.texture(image);

        $(image).hide();
        canvas.draw(texture).update();


        var distorting = true;
        // Draw a swirl under the mouse
        $(placeholder).click(function(e) {
            distorting = !distorting;
        });

        $(placeholder).mousemove(function(e) {
            if (distorting) {
                var offset = $(canvas).offset();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                canvas.draw(texture).swirl(x, y, 200, 4).update();
                Jscii.renderImage(canvas, asciiContainer[0]);
            }
        });

        placeholder.append(canvas);
        $(canvas).offset(asciiContainer.offset());
    }

});

$('.share').html(generateShareLinks("http://google.com", "sladkflkjsdljdf"));

if (window.APP) {
    var App = new AppView({ el: $("body") });
}

