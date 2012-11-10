var App = new (Backbone.View.extend({

    initialize: function() {
        this.asciiLogo();
    },

    asciiLogo: function() {
        this.asciiImage($("#logo")[0], $("#imgascii")[0]);
    },

    asciiImage: function(image, container) {
        Jscii.renderImage(image, container);
    }

}))();

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
            Jscii.renderImage(canvas, asciiContainer[0]);
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
