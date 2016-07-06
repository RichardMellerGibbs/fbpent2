var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tastercollection = new Schema({
	name: String,
	childName: String,
	email: String,
	medical: String,
    sessionDate: Date
});

module.exports.Taster = mongoose.model('Taster',tastercollection);