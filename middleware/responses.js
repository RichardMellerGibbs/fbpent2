module.exports = {
    
    handleError: function (err, req, res, next) {
        
        var logger      = require('../utils/logger.js');
        
        logError(err);
        
        /*var message = err ? err.message: "Internal Server Error";
        
        res.json({
            error: {message: message}
        });*/
        
        function logError(error) {
            logger.error({
                message: error.message,
                stack: error.stack
            });
        }
        
        
    }
}