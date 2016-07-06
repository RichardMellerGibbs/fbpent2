module.exports = {
    
    isAuthenticated: function (req, res, next) {
        
				
        var jwt        = require('jsonwebtoken');
        var config     = require('../config');
        var logger      = require('../utils/logger.js');

        var superSecret = config.secret;

        logger.info('Authenticating in middleware');
        
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            //logger.info('Token present. Now verifying');
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function(err, decoded) {
                if (err) {
                    logger.info('Token invalid');
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    //logger.info('Token valid');
                    
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {

            logger.info('No token present');
            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }    
    }
}