// =============================================================================
// RESET ROUTE /api/reset
// =============================================================================
var express     = require('express');
var router      = express.Router();  // get an instance of the express Router
var mongoose    = require('mongoose');
var models      = require('../db/models/user.js');
var config      = require('../config');
var responses   = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');

//To sevice a call from the email system to the reset link
//http://localhost:8082/api/reset
router.get('/:token', function(req, res) {
  
    logger.info('Processing reset %s',req.params.token);

    //models.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    models.User.findOne({ 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() } 
    })
    .select('resetPasswordExpires').exec(function(err, user) {

        if (err) {
            logger.error('Password reset token is invalid or has expired');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        if (!user) {
            logger.info('Password reset token is invalid or has expired');   
            return res.json({ success: false, message: 'Password reset token is invalid or has expired'});
        }

        logger.info('Token found. Expiry date %s',user.resetPasswordExpires);

        res.json({success: true,message: 'Reset validated successfully'});

    });

});

//This route is called after the user changes their password. This saves the new password
//http://localhost:8082/reset
router.post('/:token', function(req, res) {
   
    var userName = '';

	logger.info('Processing post to reset. Token %s ',req.params.token);

    //The userid specified must exist in the database
    //models.User.findOne({resetPasswordToken : req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {

    models.User.findOne({ 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() } 
    })
    .select('resetPasswordExpires').exec(function(err, user) {        
            
        if (err) {
            logger.error('Password reset token is invalid or has expired');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});        
        }

        if (!user) {
            logger.info('Password reset token is invalid or has expired');   
            return res.json({ success: false, message: 'Password reset token is invalid or has expired'});
        }
        
        logger.info('Found token now trying to save new password');
        
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
            
            if (err) {
                logger.error('Error saving the user password');
                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }

            logger.info('Password saved');

            res.json({success: true,message: 'New password saved successfully'});
                
        });
    });
    
});

module.exports = router;