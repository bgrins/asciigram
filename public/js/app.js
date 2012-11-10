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