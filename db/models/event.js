//---------------------------------------------------------------------
// EVENT MODEL

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var EventSchema = new Schema({
	eventDate: {type: Date, required: true},
	title: String,
    description: String,
    eventUrl: String,
    eventUrlDescription: String,
    picture: {type: Schema.Types.Mixed},
    createdAt: {type: Date, default: Date.now}
});

// Sets the createdAt parameter equal to the current time
EventSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});


module.exports.Event = mongoose.model('Event',EventSchema);