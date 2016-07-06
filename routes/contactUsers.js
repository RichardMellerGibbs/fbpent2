// ROUTES FOR OUR API/CONTACTUSERS
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/user.js');
var jwt        = require('jsonwebtoken');
var config     = require('../config');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger     = require('../utils/logger.js');
var sendGridApi = config.sendGridApi;
var sendgrid  = require('sendgrid')(sendGridApi);
//var mailSystem = require('../utils/mailSystem.js');

var superSecret = config.secret;
var env = config.node_env;

//Adding email request to users (accessed at POST http://localhost:8082/api/contactUsers)
//authMiddle.isAuthenticated,
router.post('/', authMiddle.isAuthenticated, function(req, res) {
  
    logger.info('Received a request contact a user via email');
    
    var admin = false;
    var standard = false;
    var additionalMember = '';
    var from = ''; 
    var subject = ''; 
    var message = ''; 
    
    logger.info('req.body.admin %s', req.body.admin);
    logger.info('req.body.standard %s', req.body.standard);
    logger.info('req.body.additionalMember %s', req.body.additionalMember);
    logger.info('req.body.from %s', req.body.from);
    logger.info('req.body.subject %s', req.body.subject);
    logger.info('req.body.message %s', req.body.message);
    
    //VALIDATION
    if (!req.body.from) {
        return res.json({ success: false, message: 'No from identifier specified'});
    } else {
        from = req.body.from; 
    }
    
    if (req.body.subject === undefined) {
        return res.json({ success: false, message: 'No subject specified'});
    } else {
        subject = req.body.subject;
    }
    
    if (req.body.message === undefined) {
        return res.json({ success: false, message: 'No message specified'});
    } else {
        message = req.body.message;
    }
    
    if (req.body.admin === true) {        
        admin = true;        
    }
    
    if (req.body.standard === true) {
        standard = true;         
    }
    
    if (req.body.additionalMember) {
        for (i=0; i<req.body.additionalMember.length; i++) {
            logger.info('spcific user %s', req.body.additionalMember[i].username);
        }
        additionalMember = req.body.additionalMember;
    }
    

    //Protect against admin false standard false and no userEmail
    if (admin === false && standard === false && additionalMember.length === 0) {
        logger.error('Must specify at least one email receiptiant');
        return res.json({ success: false, message: 'Must specify at least one email receiptiant'});
    }
    
    logger.info('About to get admin users. admin %s standard %s', admin, standard);
    
    var clauseOptions = [];
    
    //Add the or clause options to an array and then pass to the find
    
    if (admin === true && standard === true) {
        clauseOptions.push({"admin" : true})
        clauseOptions.push({"admin" : false});
    }
    
    if (admin === true && standard === false) {
        clauseOptions.push({"admin" : true})
    }
    
    if (admin === false && standard === true) {
        clauseOptions.push({"admin" : false});
    }
    
    if (additionalMember.length > 0) {
        for (i=0; i<additionalMember.length; i++) {
            clauseOptions.push({"username" : additionalMember[i].username});
        }
    }
    
    
    logger.info('clauseOptions %s',JSON.stringify(clauseOptions));
    
    //adminClause = '"{$or" :' + clauseOptions + "}";
    
    //{"$or" : [{"admin" : admin}, {"admin" : standard}]}
    //adminClause = {"$or" : [{"admin" : false}, {"username" : userEmail}]};
    
    models.User.find({"$or" : clauseOptions})
    .select('-_id username admin')    
    .exec(function(err,users) {
    
        if (err) {
            logger.error('Error getting users');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        var userList = [];
        
        var email     = new sendgrid.Email(); 
        email.from      = from;
        email.subject   = subject;
        email.text      = message;
        
        for (var i = 0; i < users.length; i++) {
    
            logger.info('User is: ' + users[i].username);
            userList.push('"' + users[i].username + '"');
            
            email.addTo(users[i].username);
        }
            
        //logger.info('userList %s',userList);
        
        //email.setSmtpapiTos = userList;
        
        if (env == 'development') {
            logger.info('Dev mode. Not really sending an email');    
            return res.json({success: true,message: 'pretend email Sent!'});
        }
    
        sendgrid.send(email, function(err, json) {

          if (err) { 
              logger.error('Error from senGrid.send');

              responses.handleError(err,req,res);   
              return res.json({ success: false, message: 'Internal server error'});
          } else {
              logger.info('Message sent: ' + JSON.stringify(json));
              res.json({success: true,message: 'email Sent!'});
          }
        });
    });
    
    //Find the users to email
    
    //email.setTos(['foo@bar.com', 'another@another.com']);
    //or
    //email.setSmtpapiTos(["test@test.com","test2@test.com"]);
    

    
    
    
    /*
    mailSystem.sendEmail(from, to, subject, message,  function(err, res) {

        if (err) { 
            logger.error('Error from mailSystem.sendEmail');

            responses.handleError(err,req,res);   
            return res.json({
                success: false, 
                message: 'Internal server error'
            });
        } else {
            logger.info('Message sent: ' + JSON.stringify(res));
            res.json({
                success: true,
                message: 'email Sent!'
            });
        }
    });
    */
});

module.exports = router;