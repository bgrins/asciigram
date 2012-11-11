
var AppView = Backbone.View.extend({

    SEND_TO_SERVER: false,
    thumbTemplate: Handlebars.compile($("#video-list").html()),

    events: {
        "click #save": "save",
        "click .save-image": "saveImage",
        "click #record": "toggleRecord",
        "click #results li": "previewFile",
        "click #webcam": "previewLiveVideo",
        "click #show-image": "previewStillImage",
        "click": "cancelPreview",
        "click #snapshot": "takeSnapshot"
    },

    cancelPreview: function() {
        $("body").removeClass("previewing");
    },

    previewFile: function(e) {

        var file = FileStore.getByID($(e.currentTarget).data("id"));
        if (file.frames) {
            this.GL.stop();
            $("#imgascii").html(file.frames[0].content);
            /*
            $("body").addClass("previewing");
            $("#full-preview a").attr("href", "/view/" + file.id).text(file.id);
            $("#full-preview pre").html(file.frames[0].content);
            */
        }
        this.previewStillImage();

        return false;

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

        this.pushCurrentBufferToServer(function(id) {
            $(e.currentTarget).closest(".gram-container").find("a").attr("href", "/view/" + id).text(id);
        });
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

        this.pushCurrentBufferToServer(function() {
            log("Snapshot taken");
        });
    },

    pushCurrentBufferToServer: function(cb) {
        var frames = this.getCurrentFrames();
        var ajax = $.post("add", { frames: JSON.stringify(frames) });
        var that = this;
        ajax.done(function(id) {
            that.addVideoToLocalStorage(id, frames);
            cb(id);
        });
    },

    renderThumbs: function() {

        var that = this;
        var templateHTML = _.map(FileStore.get(), function(i) {

            return that.thumbTemplate({
                preview: new Frame(i.frames[0]).content,
                id: i.id
            });

        }).join("");

        $("#results").html(templateHTML);
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
            FileStore.push({
                id: guid(),
                frames: frames
            });

            this.renderThumbs();
        }
    },

    addVideoToLocalStorage: function(id, frames) {

        FileStore.push({
            id: id,
            frames: frames
        });

        this.renderThumbs();
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
