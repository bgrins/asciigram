
var store = (function() {

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
        }
    }

})();

log("Stored Files", store.get("files"));

var FrameBuffer = {
    _frames: [],
    add: function(content) {
        FrameBuffer._frames.push({
            content: content,
            timestamp: Date.now
        });
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

var App = new (Backbone.View.extend({

    events: {
        "click #save": "save"
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
            var allSaved = store.get("files") || [];
            allSaved.push({
                id: id,
                frames: frames
            });
            store.set("files", allSaved);

            log(store.get("files"));
        });
    },

    initialize: function() {
        this.asciiLogo();
        //getUserMedia(userMediaOptions, this.userMediaSuccess, this.userMediaError);

        FileReaderJS.setupDrop(document.body, this.fileReaderOpts);
        FileReaderJS.setupClipboard(document.body, this.fileReaderOpts);

    },

    userMediaSuccess: function() {

    },

    userMediaError: function() {

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
        this.asciiImage($("#logo")[0], $("#imgascii")[0]);
    },

    asciiImage: function(image, container) {
        Jscii.renderImage(image, container);
    }

}))({ el: $("body") });

var userMediaOptions = {
    "audio": false,
    "video": true,
    el: "webcam",

    extern: null,
    append: true,
    width: 320,
    height: 240,

    mode: "callback",
    swffile: "../dist/fallback/jscam_canvas_only.swf",
    quality: 85,
    context: "",

    debug: function () {},
    onCapture: function () {
        //window.webcam.save();
    },
    onTick: function () {},
    onSave: function (data) {
/*
        var col = data.split(";"),
            img = App.image,
            tmp = null,
            w = this.width,
            h = this.height;

        for (var i = 0; i < w; i++) {
            tmp = parseInt(col[i], 10);
            img.data[App.pos + 0] = (tmp >> 16) & 0xff;
            img.data[App.pos + 1] = (tmp >> 8) & 0xff;
            img.data[App.pos + 2] = tmp & 0xff;
            img.data[App.pos + 3] = 0xff;
            App.pos += 4;
        }

        if (App.pos >= 4 * w * h) {
            App.ctx.putImageData(img, 0, 0);
            App.pos = 0;
        }
*/
    },
    onLoad: function () {}
};

function init(image) {

    var placeholder = $("#gl-container");
    var asciiContainer= $("#imgascii");

    var asciiWidth = asciiContainer.width();
    $(image).width(asciiWidth);

    try {
        var canvas = fx.canvas();
    }
    catch (e) {
        placeholder.html(e);
        return;
    }


    // Create a texture from the image and draw it to the canvas
    var texture = canvas.texture(image);
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
            //Jscii.renderImage(canvas, asciiContainer[0]);
        }
    });

    $(image).hide();
    log(asciiContainer, asciiContainer.offset())
    placeholder.append(canvas);
    $(canvas).offset(asciiContainer.offset());
}


$("#logo").on("load", function() {
    init(this);
});
