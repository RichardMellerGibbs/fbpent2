// =============================================================================
// FORGOT ROUTE /api/forgot
// =============================================================================
var crypto      = require('crypto');
var express     = require('express');
var router      = express.Router();  // get an instance of the express Router
var mongoose    = require('mongoose');
var models      = require('../db/models/user.js');
var config      = require('../config');
var responses   = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');
var sendGridApi = config.sendGridApi;
var sendgrid    = require('sendgrid')(sendGridApi);

//To sevice I forgot my password request
//http://localhost:8082/api/forgot
router.post('/', function(req, res) {
   
    var userName = '';

	logger.info('Processing api request to forgot %s',req.body.username);

    if (!req.body.username) {
        return res.json({ success: false, message: 'Username must be specified'});
    }

    userName = req.body.username;

    //Generate a random string which will become the token
    crypto.randomBytes(20, function(err, buf) {

        if (err) {
            logger.error('Failed to generate forgot token');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        //Continue
        var token = buf.toString('hex');
        logger.info('token is %s',token);

        //The userid specified must exist in the database
        //models.User.findOne({username : userName}, function (err, user) {
        models.User.findOne({ 
            username : userName
        })
        .select('username').exec(function(err, user) {
                
            if (err) {
                logger.error('User could not be found');
                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});        
            }

            if (!user) {
                logger.info('Username could not be found');   
                return res.json({ success: false, message: 'Username could not be found'});
            }
            
            logger.info('Found user now trying to save token');
            //Continue
            //Assign the token to the user schema along with an expiration date
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            //Save those details away
            user.save(function(err) {
                
                if (err) {
                    logger.error('Error saving the user schema');
                    responses.handleError(err,req,res);   
                    return res.json({ success: false, message: 'Internal server error'});
                }

                logger.info('Token saved now send the email. Headers %s',req.headers.host);

                var emailText = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                //'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                                'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                                'If you did not request this, please ignore this email and your password will remain unchanged.\n';
                
                logger.info('Message %s',emailText);

                //richardmellergibbs@gmail.com
                
                //Continue 
                //Email the user with the instruction
                var email       = new sendgrid.Email(); 
                email.from      = 'FiveBoroughsPentathlon';
                email.subject   = 'Password reset request';
                email.text      = emailText;
                email.addTo(userName);

                sendgrid.send(email, function(err, json) {

                    if (err) { 
                        logger.error('Error from senGrid.send');
                        responses.handleError(err,req,res);   
                        return res.json({ success: false, message: 'Internal server error'});
                    }

                    //Continue
                    logger.info('Forgot email created and message sent: ' + JSON.stringify(json));
                    res.json({success: true,message: 'Forgot token generated and email sent'});
                    
                });        
            });
        });
    });
   
});

module.exports = router;