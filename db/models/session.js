//---------------------------------------------------------------------
// SESSION MODEL

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var SessionSchema = new Schema({
	sessionDate: {type: Date, required: true, index: { unique: true }},
	running: Boolean,
    shooting: Boolean,
    fencing: Boolean
});


module.exports.Session = mongoose.model('Session',SessionSchema);