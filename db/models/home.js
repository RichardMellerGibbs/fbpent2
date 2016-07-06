//---------------------------------------------------------------------
// HOME MODEL

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var HomeSchema = new Schema({
	name: {type: String, required: true},
    description: {type: String, required: true},
    title: {type: String, required: true}
});

module.exports.Home = mongoose.model('Home',HomeSchema);