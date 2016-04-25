var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.createConnection('mongodb://localhost/pinterest-clone');

var PinSchema = new Schema({
	title: {
		type: String
	},
	url: {
		type: String
	},
	published: {
		type: Date,
		default: Date.now()
	},
	addedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

var Pin = module.exports = mongoose.model('Pin', PinSchema);