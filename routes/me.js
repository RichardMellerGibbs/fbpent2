// ROUTES FOR OUR API/ME
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var authMiddle = require('../middleware/authenticate.js');
var logger      = require('../utils/logger.js');

//Adding a user entry (accessed at POST http://localhost:8082/api/me)
router.get('/', authMiddle.isAuthenticated, function(req, res) {
 
    logger.info('Inside me req. Returning');
    res.send(req.decoded);    
});
                      
module.exports = router;