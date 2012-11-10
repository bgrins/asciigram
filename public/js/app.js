var Store = (function() {

    var _store = window.localStorage || { };

    return {
        get: function(key) {
            if (_store[key] !== undefined) {
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
    };

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

var AppView = Backbone.View.extend({

    SEND_TO_SERVER: false,
    memoryStore: [],
    thumbTemplate: Handlebars.compile($("#video-list").html()),

    events: {
        "click #save": "save",
        "click #record": "toggleRecord"
    },

    toggleRecord: function() {
        var record = $("#record");

        if (!this.recording) {
            FrameBuffer.clear();
            record.addClass("btn-warning");
        }
        else {
            record.removeClass("btn-warning");
            this.save();
        }

        this.recording = !this.recording;

    },

    getCurrentFrames: function() {
        return FrameBuffer.get();
    },

    save: function() {

        var frames = this.getCurrentFrames();

        if (frames.length === 0) {
            log("Error, no frames provided");
            return;
        }

        if (this.SEND_TO_SERVER) {
            var ajax = $.post("add", { frames: JSON.stringify(frames) });
            var that = this;
            ajax.done(function(id) {
                that.addVideoToLocalStorage(id, frames);
            });
        }
        else {
            App.memoryStore.push({
                id: "no id",
                frames: _.map(frames, function(f) {
                    return new Frame(f);
                })
            });

            var that = this;
            var templateHTML = _.map(App.memoryStore, function(i) {

                return that.thumbTemplate({
                    preview: i.frames[0].content
                });
            }).join("");

            $("#results").html(templateHTML);
        }
    },

    addVideoToLocalStorage: function(id, frames) {

        var allSaved = Store.get("files") || [];
        allSaved.push({
            id: id,
            frames: frames
        });
        Store.set("files", allSaved);
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
        FileReaderJS.setupInput(document.getElementById('file-input'), this.fileReaderOpts);
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
                img.hide();
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

    WARP_SIZE: 140,
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

        var WARP_SIZE = this.WARP_SIZE;
        $(placeholder).mousemove(function(e) {
            if (distorting) {
                var offset = $(canvas).offset();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                canvas.draw(texture).swirl(x, y, WARP_SIZE, 4).update();
                Jscii.renderImage(canvas, asciiContainer[0]);
            }
        });

        placeholder.append(canvas);
        $(canvas).offset(asciiContainer.offset());
    }

});

$('.share').html(generateShareLinks("http://google.com", "some description"));

if (window.APP) {
    var App = new AppView({ el: $("body") });
}

