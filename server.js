/**
 * Created by Danny Schreiber on 2/9/2015.
 */

var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var port = 3000;

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
	next();
});
app.use(express.static(path.join(__dirname), '/src/common/assets'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'code fighter fur life',
	resave: false,
	saveUninitialized: true
}));

app.use(cors({origin: 'http://localhost:3000'}));
app.use(logger('dev'));



//app.options('*', cors());



app.get('/movies/:title', function(req, res){
	res.sendfile('./src/index.html');
});
app.get('/movies', function(req, res){
	res.sendfile('./src/index.html');
});
app.get('/', function(req, res){
	res.sendfile('./src/index.html');
});

app.listen(port);
console.log("App listening on port " + port);