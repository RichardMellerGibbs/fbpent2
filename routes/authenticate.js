// -------------------------------------------------------------------
// route to authenticate a user (POST http://localhost:xxxx/api/authenticate)
//module.exports = function(app) {

var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/user.js');
var jwt        = require('jsonwebtoken');
var config     = require('../config');
var logger      = require('../utils/logger.js');

var superSecret = config.secret;

router.post('/', function(req, res) {

 // find the user
 // select the name username and password explicitly
    logger.info('received a request to authenticate');

    models.User.findOne({
        username: req.body.username
    })
    .select('name username password admin').exec(function(err, user) {

        if (err) {
            logger.error('Error adding contact');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        // no user with that username was found
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. Username not found.'
            });

        } else if (user) {

            // check if password matches
            logger.info('Comparing password sent in "%s"', req.body.password);

            var validPassword = user.comparePassword(req.body.password);

            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                logger.info('Password valid - generate token userid %s', user._id);
                logger.info('user.admin = %s', user.admin);
                // if user is found and password is right
                // create a token
                var token = jwt.sign({
                    name: user.name,
                    username: user.username,
                    userid: user._id,
                    admin: user.admin
                    }, superSecret, {
                        expiresIn: 18000 //5 hours //3600 // Seconds. Expires in 1 hour
                    });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token! Valid for 24 hours',
                    token: token
                });
            }

        }

    });
});
//};

module.exports = router;