
var GLView = Backbone.View.extend({

    WARP_SIZE: 140,
    distorting: true,
    initialize: function(opts) {
        if (!opts.image) {
            throw "No Image provided";
        }

        this.image = opts.image;

        this.placeholder = $("#gl-container");
        this.asciiContainer= $("#imgascii");

        try {
            this.canvas = fx.canvas();
        }
        catch (e) {
            this.canvas = $([]);
            return;
        }

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
    stop: function() {
        this.distorting = false;
        this.placeholder.unbind("click mousemove");
        $(this.canvas).remove();
    },
    toggle: function() {
        this.distorting = !this.distorting;
    },
    start: function() {
        this.distorting = true;
    },
    setupGL: function() {

        var image = this.image[0];
        var placeholder = this.placeholder;
        var asciiContainer= this.asciiContainer;

        var asciiWidth = asciiContainer.width();

        $(image).width(asciiWidth);

        var canvas = this.canvas;

        $(image).show();

        // Create a texture from the image and draw it to the canvas
        var texture = canvas.texture(image);

        $(image).hide();
        canvas.draw(texture).update();


        var that = this;
        // Draw a swirl under the mouse
        $(placeholder).click(function(e) {
            that.toggle();
        });

        var WARP_SIZE = this.WARP_SIZE;
        $(placeholder).mousemove(function(e) {
            if (that.distorting) {
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