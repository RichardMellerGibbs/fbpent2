//---------------------------------------------------------------------
// USER MODEL

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

var SessionSchema = new  Schema({
    sessionDate: {type: Date},
    running: Boolean,
    shooting: Boolean,
    fencing: Boolean
});

var MembershipSchema = new  Schema({
    fromDate: {type: Date},
    toDate: {type: Date},    
    type: {type: String},
    description: {type: String}
});

var ChildSchema = new Schema({
    name: { type: String, required: true, index: { unique: true }},
    dateOfBirth: {type: Date},
    medicalCondition: {type: String}
});

var UserSchema = new Schema({
	name:                   { type: String, required: true },
    username:               { type: String, required: true, index: { unique: true }},
	password:               { type: String, required: true, select: false },
	admin:                  Boolean,
    childName:              {type: String},
    childDOB:               {type: Date},
    childMedicalCondition:  {type: String},
    children:               [ChildSchema],
    phone:                  {type: String},
    sessions:               [SessionSchema],
    memberships:            [MembershipSchema],
    resetPasswordToken:     String,
    resetPasswordExpires:   Date
});

//Hash the password before saving
UserSchema.pre('save', function(next) {
    var user = this;
    
    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();
    
    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
    
        if (err) return next(err);
        
        // change the password to the hashed version
        user.password = hash;
        next();
    }); 
});

// Method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {
    
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

module.exports.User = mongoose.model('User',UserSchema);