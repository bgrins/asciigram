
var express = require('express'),
    http = require('http'),
    path = require('path'),
    partials = require('express-partials'),
    indexRoute = require('./routes/index'),
    mongoose = require('mongoose'),
    connect = require('connect'),
    gzip = require('connect-gzip'),
    assetManager = require('connect-assetmanager'),
    assetHandler = require('connect-assetmanager-handlers');

var app = express();

var jsFiles = [
    'common.js',
    'vendor/jquery-1.8.2.js',
    'vendor/underscore.js',
    'vendor/backbone.js',
    'vendor/bootstrap.js',
    'vendor/jscii.js',
    'vendor/glfx.js',
    'vendor/gif.js',
    'vendor/gifBookmarklet.js',
    'vendor/getUserMedia.js',
    'vendor/filereader.js',
    'vendor/handlebars.js',
    'vendor/sharingButtons.js',
    'models/file.js',
    'views/glview.js',
    'views/appview.js',
    'popular.js',
    'view.js',
    'app.js'
];

var cssFiles = [
    "bootstrap.css",
    "style.css"
];

var assetManagerGroups = {
    'js': {
        'route': /\/js\/.*/,
        'path': './public/js/',
        'dataType': 'javascript',
        'files': jsFiles,
        'debug': false,
        'preManipulate': {
            '^': []
        }
    },
    'css': {
        'route': /\/css\/.*\.css/,
        'path': './public/css/',
        'dataType': 'css',
        'files': cssFiles,
        'preManipulate': {
            '^': []
        }
    }
};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('layout', 'views/layout.ejs');
  app.use(partials());

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('secret?'));
  app.use(express.session());


  var root = __dirname + '/public';
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  // db = mongoose.connect('mongodb://127.0.0.1/asciigram');
  //db = mongoose.connect('mongodb://nodejitsu_nko3-comorichweb:97eo3g5a4b79v6o886cs5bmfp2@ds039277.mongolab.com:39277/nodejitsu_nko3-comorichweb_nodejitsudb5090763608');
  db = mongoose.connect('mongodb://nodejitsu_nko3-comorichweb:97eo3g5a4b79v6o886cs5bmfp2@ds039277.mongolab.com:39277/nodejitsu_nko3-comorichweb_nodejitsudb5090763608');

  app.set("jsFiles", jsFiles);
  app.set("development", true);
  app.set("cssFiles", cssFiles);
  app.set("appurl", "http://localhost:3000/");
});
app.configure('production', function(){
  // TO log in: mongo ds039277.mongolab.com:39277/nodejitsu_nko3-comorichweb_nodejitsudb5539601137 -u nodejitsu_nko3-comorichweb -p r1o7du673h4f7lspurbqdudqd5
  db = mongoose.connect('mongodb://nodejitsu_nko3-comorichweb:97eo3g5a4b79v6o886cs5bmfp2@ds039277.mongolab.com:39277/nodejitsu_nko3-comorichweb_nodejitsudb5090763608');
  app.use("/", assetManager(assetManagerGroups), connect.static(root));
  app.set("jsFiles", [ "site.js" ]);
  app.set("cssFiles", [ "site.css" ]);
  app.set("development", false);
  app.set("appurl", "http://comorichweb.nko3.jit.su/")
});

app.get('/', indexRoute.index);
app.get("/about", indexRoute.about);
app.post("/add", indexRoute.add);
app.all("/preview/:id", indexRoute.preview);
app.get("/view/:id", indexRoute.view);
app.get("/popular", indexRoute.popular);
app.get("/get/:id", indexRoute.get);
app.get("/frames/:id", indexRoute.frames);
app.post("/hate/:lookup", indexRoute.hate);
app.post("/love/:lookup", indexRoute.love);
app.get("/super-secret-delete2/:lookup", indexRoute.secretDelete);
app.get("/super-secret-upvote2/:lookup", indexRoute.secretUpvote);

gzip.gzip();
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
