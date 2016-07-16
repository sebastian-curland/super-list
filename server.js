var express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	app = express(),
	port = process.env.OPENSHIFT_NODEJS_PORT || 9000,
	mongoose = require('mongoose'),
	ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

//websocket
var server = require('http').Server(app);
var socket = require('socket.io')(server);
	
require('./models/listModel');
var listCtrl = require('./controllers/listCtrl')

// DB connection
// default to a 'localhost' configuration:
var connection_string = 'localhost/superListDB';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
mongoose.connect('mongodb://'+connection_string);

// Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); //logger
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.get('/', listCtrl.index);
app.post('/', listCtrl.create(socket));
app.put('/status/:productId', listCtrl.updateStatus(socket));
app.delete('/deleteAll', listCtrl.deleteAll(socket));
app.delete('/:productId', listCtrl.delete(socket));

// Request Filter
app.param('productId', listCtrl.loadProduct);

server.listen(port, ipaddr, function(err){
	console.log('listening on %s', port);
});