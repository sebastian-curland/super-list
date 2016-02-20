var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = new Schema({
	name: String,
	quantity: Number,
	status: Boolean,
	modified:{type:Date, default:Date.now}
});

mongoose.model('list', ListSchema);