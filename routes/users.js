// ROUTES FOR OUR API/SETUP
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/user.js');
var jwt        = require('jsonwebtoken');
var config     = require('../config');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');

var superSecret = config.secret;


//Adding a user entry (accessed at POST http://localhost:8082/api/user)
router.post('/',function(req, res) {
  
    logger.info('Received a request to add a user');
    
    var user = new models.User();      // create a new instance of the User model
    
    //Turned this off for security reasons
    /*if (!req.body.admin) {
        user.admin = false;
    } else {
        user.admin = req.body.admin;
    }*/
    
    if (!req.body.username) {
        return res.json({ success: false, message: 'No username specified'});
    } else {
        user.username = req.body.username;
    }
    
    if (!req.body.password) {
        return res.json({ success: false, message: 'No password specified'});
    } else {
        user.password = req.body.password; 
    }
    
    if (!req.body.name) {
        return res.json({ success: false, message: 'No name specified'});
    } else {
       user.name = req.body.name;
    }
    
    if (!req.body.phone) {
        user.phone = '';
    } else {
        user.phone = req.body.phone; 
    }

    //Only convert child dob to a string if one is supplied
    var childDOB;
    if (req.body.childDOB) {
        childDOB = new Date(req.body.childDOB).toISOString();
    }

    if (req.body.childName) {
        user.children.push({
            name: req.body.childName,
            dateOfBirth: childDOB,
            medicalCondition: req.body.childMedicalCondition
        });
    }
    
    // save the user and check for errors
    user.save(function(err) {
        
        if (err) {
            logger.error('Error adding user');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        logger.info('User successfully created userid %s', user._id);
        
        var token = jwt.sign({
            name: user.name,
            username: user.username,
            userid: user._id,
            admin: user.admin
            }, superSecret, {
                expiresIn: 18000 // seconds
            });
        
        
        logger.info('Token signed');

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'User Created. Enjoy your token! Valid for 24 hours',
            token: token
        });
        
        logger.info('Finisahed create user');
    });        
});


//To find a user that has a specified email address
//http://localhost:8082/api/users/checkname/bob@hotmail.com
router.get('/checkname/:username', function(req, res) {
//router.get('/', function(req, res) {
	//res.json({ message: 'received a request to get the contacts' });   
	logger.info('Processing api request to get username %s', req.params.username);
    
    if (!req.params.username) {
        return res.json({ success: false, message: 'username not specified'});
    }
    
    models.User.find({username : req.params.username}, function (err, user) {
        
        if (err) {
            logger.error('Error getting users ny name');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});        
        }
        
        if (user.length){
            //Already exists
            return res.json({ success: true, message: 'EXISTS'});
        }
    
        //Username not found
        return res.json({ success: true, message: 'NOT EXISTS'});
    });

});


// get all the Users (accessed at GET http://localhost:8082/api/users)
router.get('/', authMiddle.isAuthenticated, function(req, res) {
//router.get('/', function(req, res) {
	//res.json({ message: 'received a request to get the contacts' });   
	logger.info('Processing api request to get all the users');
    
    /* models.User.find(function(err, users) { */
    models.User.find()
    .sort('name')
    .exec(function(err,users) {
    
        if (err) {
            logger.error('Error getting all users');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json(users);
    });

});


// get the user with that id (accessed at GET http://localhost:xxxx/api/users/:user_id)
//http://localhost:8082/api/users/569b965f352607cc1ea053b6 gets lilly's id

//To get bob@hotmail.com use    password time
//and pass in a sessionDate to search for use
//http://localhost:8082/api/users/56cf706d53ce3e0c1c8fdc03?sessionDate=2016-02-23T00:34:39.446Z 
//This allows the server to send back just the required session and not all of them.
router.get('/:user_id', authMiddle.isAuthenticated, function(req, res) {

    logger.info('Processing request to get a single user specified by id %s', req.params.user_id);
    
    
    models.User.findById(req.params.user_id, function(err, user) {
    
        if (err) {
            logger.error('Error getting the user schema');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        if (req.query.sessionDate){
            logger.info('req.query.sessionDate = %s', req.query.sessionDate);        
            
            var sessionDate = new Date(req.query.sessionDate).toDateString();
            logger.info('sessionDate = %s', sessionDate); 
            
            var sessions;
            var sessionFound = false;
            
            if (user.sessions != undefined) {
                for (var i = 0; i < user.sessions.length; i++) {

                    var storedSessionDate = new Date(user.sessions[i].sessionDate).toDateString();
                    
                    if (storedSessionDate == sessionDate) {

                        logger.info('Date FOUND for %s', req.query.sessionDate);
                        sessionFound = true;
                        sessions = user.sessions[i];
                        user.sessions = sessions;                    
                    } 
                }
            }
            
            if (!sessionFound){
                user.sessions = sessions;        
            }
        } 
        
        // return that user
        res.json(user);
    });
});



// update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
//If sessionID is supplied then this session, if found, will be updated by the session body //paramters. sessionDate is not requiored and will be ignored.
//If sessionID is not supplied or cannot be found then a new session will be added providing
//sessionDate and one of shoot, run or swim have been provided in the parameters
router.put('/:user_id', authMiddle.isAuthenticated, function(req, res, next) {
 
    logger.info('Processing request to update a single user specified by id %s', req.params.user_id);
    // use our user model to find the user we want
    models.User.findById(req.params.user_id, function(err, user) {

        if (err) res.send(err);
        
        logger.info('Found the user');
        
        // update the users info only if its new
        if (req.body.name) {
            user.name = req.body.name;
        };
        
        if (req.body.username){
            user.username = req.body.username;
        };
        
        if (req.body.password){ 
            user.password = req.body.password;
        }
        
        if (req.body.phone){ 
            user.phone = req.body.phone;
        }
        
        if (req.body.admin){ 
            user.admin = req.body.admin;
        }
        
        /*if (req.body.childName){ 
            console.log('Seeing a change in the childName ' + req.body.childName);
            user.childName = req.body.childName;
        };
        
        if (req.body.childDOB){
            user.childDOB = req.body.childDOB;
        };
        
        if (req.body.childMedicalConditon){
            console.log('Seeing a change in the childMedicalConditon ' + req.body.childMedicalConditon);
            user.childMedicalConditon = req.body.childMedicalConditon;
        };*/
        

        var sessionFound = false;
        
        if (req.body.sessionID) {
            console.log('sessionID present ' + req.body.sessionID);
            
            if (user.sessions != undefined) {
                for (var i = 0; i < user.sessions.length; i++) {                

                    if (user.sessions[i]._id == req.body.sessionID){

                        logger.info('Session FOUND for %s', req.body.sessionID);
                        sessionFound = true;
                        
                        logger.info('running is actually set %s', req.body.running);
                        user.sessions[i].running = req.body.running;                                            

                        logger.info('shooting is actually set %s', req.body.shooting);
                        user.sessions[i].shooting = req.body.shooting;

                        logger.info('fencing is actually set %s', req.body.fencing);
                        user.sessions[i].fencing = req.body.fencing;
                        
                    }
                } 
            }
        }
        
        //Either session not found or no id supplied. So add this session
        if ((req.body.running || req.body.shooting || req.body.fencing ) && ((!sessionFound) && (req.body.sessionDate))) {
            logger.info('Either session not found or no id supplied. Adding session');                
            user.sessions.push({ 
                sessionDate: new Date(req.body.sessionDate).toISOString(),
                running: req.body.running,
                shooting: req.body.shooting,
                fencing: req.body.fencing
            });
        }
        
        //Deal with children rows
        var childFound = false;
        
        if (req.body.childID) {
            logger.info('ChildID present %s', req.body.childID);
            //console.log('Children count ' + user.children.length);
            
            if (user.children != undefined) {
                for (var i = 0; i < user.children.length; i++) {                

                    //console.log('DB Child name ' + user.children[i].name)
                    if (user.children[i]._id == req.body.childID){

                        logger.info('Child entry FOUND for %s', req.body.childID);
                        childFound = true;

                        if (req.body.childName) {
                            logger.info('Child name is set %s', req.body.childName);
                            user.children[i].name = req.body.childName; 
                        }
                        
                        if (req.body.childDOB) {
                            logger.info('Child dob is set %s', req.body.childDOB);
                            user.children[i].dateOfBirth = new Date(req.body.childDOB).toISOString();
                        }
                        
                        if (req.body.childMedicalCondition) {
                            logger.info('Child medical condition is set %s', req.body.childMedicalCondition);
                            user.children[i].medicalCondition = req.body.childMedicalCondition;
                        }

                    }
                } 
            }
        }
        
        //Either children not found or no id supplied. So add this child
        if ((req.body.childName || req.body.childDOB || req.body.childMedicalCondition ) && !childFound ) {
            
            logger.info('Either child not found or no id supplied. Adding child'); 
            
            var childDob = '';
            if (req.body.childDOB) {
                childDob = new Date(req.body.childDOB).toISOString();
            } 
            
            user.children.push({
                name: req.body.childName,
                dateOfBirth: childDob,
                medicalCondition: req.body.childMedicalCondition
            });
        }
        
        
        
        
        //Find current memebership
        var memebershipFound = false;
        
        if (req.body.membershipFrom) {
            console.log('membershipFrom present ' + req.body.membershipFrom); 
            
            if (user.memberships != undefined) {
                for (var i = 0; i < user.memberships.length; i++) {
                    if (user.memberships[i].fromDate == new Date().toISOString(req.body.membershipFrom)) {
                        logger.info('Membership FOUND for %s', req.body.membershipFrom);
                        memebershipFound = true;
                        
                    }
                }        
            }
        }
        
       
        if ((req.body.membershipFrom) && (!memebershipFound)) {
            logger.info('Membership not found and fromDate supplied. Adding membership');                
            user.memberships.push({
                fromDate: new Date(req.body.membershipFrom).toISOString(),
                toDate: new Date(req.body.membershipTo).toISOString(),
                type: req.body.membershipType,
                description: req.body.membershipDescription
            });        
        }
        
            
        
        logger.info('About to save the user schema');
        // save the user
        user.save(function(err) {
            
            if (err) {
                
                if (err.code == 11000) {
                    logger.info('A user with that email address already exists');
                    return res.json({ success: false, message: 'A user with that email address already exists. '});
                }
        
                logger.error('Error saving the user schema');
                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }
            
            res.json({ success: true, message: 'User updated!' });        
            
        });
        
    });
});



// delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
router.delete('/:user_id', authMiddle.isAuthenticated, function(req, res) {
    
    logger.info('Processing request to delete a single user specified by id %s', req.params.user_id);
    
    models.User.remove({_id: req.params.user_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting the user schema');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        res.json({ message: 'Successfully deleted' });
    });
});



module.exports = router;