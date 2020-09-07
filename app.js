var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/sportsclub',{useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex :true});
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("connected to mongoDb!!");
});

app.set('view engine', 'ejs')
//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var methodOverride = require('method-override')

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// serve static files from template
app.use(express.static(__dirname + '/views'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

var admin = require('./routes/admin');
app.use('/admin', admin);

//var user = require('./routes/member');
//app.use('/user', user);

var guest = require('./routes/guest');
app.use('/guest', guest);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session1 = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session1({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())



// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});