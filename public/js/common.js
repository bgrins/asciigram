
var Store = (function() {
    var USE_LOCAL_STORAGE = true;
    var _store = USE_LOCAL_STORAGE && window.localStorage || { };
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
            if (window.localStorage && _store === window.localStorage && window.localStorage.clear) {
                window.localStorage.clear();
            }
            else {
                _store = {};
            }
        }
    };

})();

(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var util = {
    stringToBytes: function(s) {
        return encodeURI(s).split(/%..|./).length - 1;
    },
    prettyFileSize: function(bytes) {
        var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes)/Math.log(1024));
        return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
    }
};


// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {

    // Generate four random hex digits.
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

window.log = function(){

    if (typeof console != 'undefined' && typeof console.log == 'function') {

      if ((Array.prototype.slice.call(arguments)).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === 'string') {
        console.log( (Array.prototype.slice.call(arguments)).toString() );
      }
      else {
        console.log( Array.prototype.slice.call(arguments) );
      }
    }

};
