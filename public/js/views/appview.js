
var AppView = Backbone.View.extend({
    SEND_TO_SERVER: false,
    RESOLUTION: 150,

    currenFile: [ ],
    thumbTemplate: Handlebars.compile($("#video-list").html()),
    events: {
        "click #save": "save",
        "click .save-image": "saveImage",
        "click #record": "toggleRecord",
        "click #results pre": "previewFile",
        "click #webcam": "previewLiveVideo",
        "click #show-image": "previewStillImage",
        "click": "cancelPreview",
        "click #snapshot": "takeSnapshot",
        "change #quality": "changeResolution",
        "click #sync": "syncCurrent"
    },

    cancelPreview: function() {
        $("body").removeClass("previewing");
    },

    previewFile: function(e) {
        var file;
        if ($.isFunction(e.preview)) {
            file = e;
        } else {
            FileStore.getByID($(e.currentTarget).closest("li").data("id"));
        }

        if (file) {
            this.GL.stop();
            this.currentFile = file;
            file.frames(function(frames) {
                $("#play-controls").toggle(frames.length > 1);
            });
            
            new FilePlayer(file, $("#imgascii")[0], function(player) {
            });
        }

        this.previewStillImage();
        return false;
    },

    changeResolution: function() {
        this.RESOLUTION = parseInt($("#quality").val()) || 10;
        Jscii.setResolution(this.RESOLUTION);
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

    saveImage: function(e) {
        var frame = $(e.currentTarget).closest(".gram-container").find("pre").html();
        FrameBuffer.set(frame);
        this.save();
    },

    addDataURLSnapshot: function(url) {
        var that = this;
        var img = new Image();
        img.onload = function() {
            var pre = $("<pre />");
            App.asciiImage(img, pre[0]);
            FrameBuffer.set(pre.html());

            that.addVideoToLocalStorage(guid(), that.getCurrentFrames());
        };
        img.src = url;

    },

    takeSnapshot: function(e) {
        var frame = $("#videoascii").html();
        FrameBuffer.set(frame);
        this.save();
    },

    renderThumbs: function() {
        var that = this;
        var tmpl = that.thumbTemplate;

        $("#results").empty();
        _.each(FileStore.get(), function(file) {
            file.preview(function(preview) {
                // console.log("preview");
                 var obj = {
                     id: file.id, 
                     preview: preview.content
                 };

                // console.log(obj);
                $("#results").append(tmpl(obj));
            })
        });
    },

    save: function() {
        var frames = this.getCurrentFrames();
        if (frames.length === 0) {
            log("Error, no frames provided");
            return;
        }

        var file = new File(guid(), frames);
        FileStore.push(file);
        this.previewFile(file);
        this.renderThumbs();
    },

    syncCurrent: function(cb) {
        if (this.currentFile) {
            this.currentFile.sync(cb);
        }
    },

    initialize: function() {
        this.asciiLogo();

        var that = this;
        Jscii.renderVideo($('#video')[0], $('#videoascii')[0], function() {
            $("body").addClass("webcam-enabled");
            $(".never-enabled").remove();
            that.previewLiveVideo();
            FrameBuffer.clear();
        }, function(markup) {
            if (that.recording) {
                FrameBuffer.add(markup);
            }
        });

        this.renderThumbs();

        FileReaderJS.setupDrop(document.body, this.fileReaderOpts);
        FileReaderJS.setupClipboard(document.body, this.fileReaderOpts);
        FileReaderJS.setupInput(document.getElementById('file-input'), this.fileReaderOpts);
    },

    previewLiveVideo: function() {
        $("body").removeClass("no-video").addClass("yes-video");
    },
    previewStillImage: function() {
        $("body").removeClass("yes-video").addClass("no-video");
    },

    fileReaderOpts: {
        accept: "image/*",
        on: {
            load: function(e, file) {
                App.addDataURLSnapshot(e.target.result);
                //var container = $("<div class='gram-container'><pre></pre><div><button class='btn save-image'>Save</button><a target='_blank'></a></div>").appendTo("body");
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
