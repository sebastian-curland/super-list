var express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	app = express(),
	port = process.env.PORT || 9000,
	mongoose = require('mongoose');

//websocket
var server = require('http').Server(app);
var socket = require('socket.io')(server);
	
require('./models/listModel');
var listCtrl = require('./controllers/listCtrl')

// DB connection
mongoose.connect('mongodb://localhost/superListDB');

// Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); //logger
app.set('view engine', 'ejs');


// Routes
app.get('/', listCtrl.index);
app.post('/', listCtrl.create(socket));
app.put('/status/:productId', listCtrl.updateStatus(socket));
app.delete('/:productId', listCtrl.delete(socket));

// Request Filter
app.param('productId', listCtrl.loadProduct);

server.listen(port, function(err){
	console.log('listening on %s', port);
});