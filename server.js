
var express = require('express'),
    http = require('http'),
    path = require('path'),
    partials = require('express-partials'),
    indexRoute = require('./routes/index'),
    mongoose = require('mongoose'),
    connect = require('connect'),
    gzip = require('connect-gzip'),
    userRoute = require('./routes/user');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('layout', 'views/layout.ejs');
  app.use(partials());

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.cookieParser('secret?'));
  app.use(express.session());

  app.use(connect.compress());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  db = mongoose.connect('mongodb://127.0.0.1/asciigram');
});
app.configure('production', function(){
  db = mongoose.connect('mongodb://nodejitsu_nko3-comorichweb:r1o7du673h4f7lspurbqdudqd5@ds039277.mongolab.com:39277/nodejitsu_nko3-comorichweb_nodejitsudb5539601137');
});

app.get('/', indexRoute.index);
app.get("/about", indexRoute.about);
app.post("/add", indexRoute.add);
app.get("/view/:id", indexRoute.view);
app.get("/popular", indexRoute.popular);
app.get("/get/:id", indexRoute.get);
app.get("/embed/:id", indexRoute.embed);
app.get("/preview/:id", indexRoute.preview);

gzip.gzip();
http.createServer(app).listen(app.get('port'), function(){  
  console.log("Express server listening on port " + app.get('port'));
});
