var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connect = require('connect');
var http = require('http');
var config = require('./config')();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var mongoAddress = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery';

MongoClient.connect(mongoAddress, function(err,db){
	if(err){
		console.log('no mongodb server running');
	} else{
		var attachDB = function(req, res, next){
			req.db = db;
			next();
		};
		http.createServer(app).listen(27017, function(){
			console.log('Express server listening on port 27017');
		});
	};
});

app.set('view engine', 'jade');
app.set('view', './views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;