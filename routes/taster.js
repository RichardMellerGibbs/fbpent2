// ROUTES FOR OUR API/TASTER
// =============================================================================
var express     = require('express');
var router      = express.Router();  // get an instance of the express Router
var mongoose    = require('mongoose');
var authMiddle  = require('../middleware/authenticate.js');
var models      = require('../db/models/taster.js');
var userModel   = require('../db/models/user.js');
var logger      = require('../utils/logger.js');
var config      = require('../config');
var sendGridApi = config.sendGridApi;
var sendgrid    = require('sendgrid')(sendGridApi);

var env = config.node_env;

//Adding a taster entry (accessed at POST http://localhost:8082/api/taster)
router.post('/',function(req, res) {
  
    logger.info('Received request to save a taster session');
    //logger.info('Received request to save a taster session. firstname '  + req.body.firstname, document);
    logger.info('Received request to save a taster session. name %s', req.body.name);     
    logger.info('received a request to save a taster session child name %s', req.body.childName);
    logger.info('received a request to save a taster session sessionDate %s', req.body.sessionDate);
    
    //VALIDATION
    if (!req.body.name) {
        return res.json({ success: false, message: 'No name specified'});
    }
    
    if (!req.body.email) {
        return res.json({ success: false, message: 'No email specified'});
    }
    
    if (!req.body.sessionDate) {
        return res.json({ success: false, message: 'No sessionDate specified'});
    }
    
    var taster = new models.Taster();      // create a new instance of the Taster model
    taster.name = req.body.name;  // set the Taster name (comes from the request)
    taster.childName = req.body.childName; 
    taster.email = req.body.email; 
    taster.medical = req.body.medical; 
    taster.sessionDate = req.body.sessionDate; 

    // save the taster and check for errors
    taster.save(function(err) {
        
        if (err) {
            logger.error('Error saving taster session');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        logger.info('Ssved the taster. Moving on....');
        
        //Now email Paul Hooper that someone has booked a taster session
        
        //{name: 'Paul Hooper'}
        var regex = new RegExp('Paul Hooper', 'i'), query = { name: regex };
        
        userModel.User.findOne(query, function(err, user) {
        
            if (err) {
                logger.error('Error finding paul hooper');

                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            } else {

                logger.info('pauls email is %s',user.username);    
                
                if (env == 'development') {
                    logger.info('Dev mode. Not really sending an email');    
                    return res.json({ success: true, message: 'Taster created and pretend email sent'});
                }
                
                //Email Paul
                var email     = new sendgrid.Email(); 
                email.from      = user.username;
                email.subject   = 'Pentathlon Taster Booking';
                email.text      = 'A taster booking has been amde by ' + req.body.name;
                email.addTo(user.username);

                sendgrid.send(email, function(err, json) {

                  if (err) { 
                      logger.error('Error from senGrid.send');

                      responses.handleError(err,req,res);   
                      return res.json({ success: false, message: 'Internal server error'});
                  } else {
                      logger.info('Taster created and message sent: ' + JSON.stringify(json));
                      res.json({success: true,message: 'Taster created and email sent'});
                  }
                });
            }
        });

        
    });
        
});

// get all the Tasters (accessed at GET http://localhost:8082/api/taster)
router.get('/', authMiddle.isAuthenticated, function(req, res) {
	//res.json({ message: 'received a request to get the contacts' });   
	logger.info('received a request to get the taster sessions booked');
	
    /*models.Taster.find(function(err, tasters) {*/
    models.Taster.find()
    .sort({'sessionDate': 'desc'})
    .exec(function(err,tasters) {
        
        if (err) {
            logger.error('Error getting all taster sessions');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json(tasters);
    });

});

// delete the taster session with this id (accessed at DELETE http://localhost:8080/api/taster/:taster_id)
//authMiddle.isAuthenticated,
router.delete('/:taster_id', authMiddle.isAuthenticated, function(req, res) {
    
    logger.info('Processing request to delete a taster sessaion specified by id %s', req.params.taster_id);
    
    models.Taster.remove({_id: req.params.taster_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting taster session');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json({ 
            success: true,
            message: 'Taster session successfully deleted' 
        });
    });
});

module.exports = router;