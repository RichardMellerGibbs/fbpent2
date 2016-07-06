// ROUTES FOR OUR EVENTS API
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/event.js');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');
        require('datejs');

// get all the Events (accessed at GET http://localhost:8082/api/events)
router.get('/', authMiddle.isAuthenticated, function(req, res) {

    logger.info('Processing api request to get all the events');
        
    models.Event.find()
    .sort({'eventDate': 'desc'})
    .exec(function(err,events) {        
        
        if (err) {
            logger.error('Error getting all events');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json(events);
    });
});


router.get('/:event_id', authMiddle.isAuthenticated, function(req, res) {

    logger.info('Processing request to get a single event specified by id %s', req.params.event_id);
    
    if (req.params.event_id === undefined) {
        return res.json({ success: false, message: 'No event_id specified'});
    }
    
    models.Event.findById(req.params.event_id, function(err, event) {
        
        if (err) {
            logger.error('Error getting the event schema');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }        
        
        if (!event) {
            //No data found
            responses.handleError(new Error('Error finding the event id ' + req.params.event_id),req,res);  
            return res.json({ success: false, message: 'Internal server error'});
        }
    
        res.json(event);
    });
});


//Adding a session entry (accessed at POST http://localhost:8082/api/events)
router.post('/',authMiddle.isAuthenticated, function(req, res) {
  
    logger.info('Received a request to add a event');
    
    //VALIDATION
    if (!req.body.eventDate) {
        return res.json({ success: false, message: 'No eventDate specified'});
    }
    
    if (!req.body.title) {
        return res.json({ success: false, message: 'No title specified'});
    }
    
    if (!req.body.description) {
        return res.json({ success: false, message: 'No description specified'});
    }
    
    
    var event = new models.Event();      // create a new instance of the Event model
    event.eventDate = new Date(req.body.eventDate).toISOString(),
    event.title = req.body.title;  
    event.description = req.body.description;  
    //event.image.data = req.body.image;  
    
    if (req.body.picture){
        event.picture = req.body.picture;
    }
    
    logger.info('req.body.title %s', req.body.title);
    logger.info('req.body.picture %s', req.body.picture);
    
    // save the session and check for errors
    event.save(function(err) {
        
        if (err) {
            
            if (err.code == 11000) {
                logger.info('That event date already exists %s', req.body.eventDate);
                return res.json({ success: false, message: 'That event date already exists.'});
            }

            logger.error('Error adding event');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        logger.info('Session successfully created event_id %s', event._id);

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Event Created'
        });
    });        
});



// update the session with this id (accessed at PUT http://localhost:8080/api/events/:event_id)
//authMiddle.isAuthenticated,
router.put('/:event_id', authMiddle.isAuthenticated,  function(req, res) {
 
    logger.info('Processing request to update a single event specified by id %s', req.params.event_id);

    models.Event.findById(req.params.event_id , function(err, event) {

        if (err) {
            logger.error('Error getting event %s', req.params.event_id);

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        logger.info('Found event %s', req.params.event_id);
        logger.info('Description %s', req.params.description);
        
        if (req.body.eventDate){
            event.eventDate = new Date(req.body.eventDate).toISOString();
        };

        if (req.body.title){
            event.title = req.body.title;
        }
        
        if (req.body.description){
            logger.info('description is populated');
            event.description = req.body.description;
        }
        
        if (req.body.picture){
            logger.info('picture is populated %s', req.body.picture);
            event.picture = req.body.picture;
        }
        
        //event.image.data = req.body.image;
        
        logger.info('About to save the event schema');
        // save the user
        event.save(function(err) {
            
            if (err) {
                logger.error('Error saving event');

                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }

            // return a message
            res.json({ 
                success: true,
                message: 'Event updated!' 
            });
        });        
    });            
});


// delete the event with this id (accessed at DELETE http://localhost:8080/api/events/:event_id)
router.delete('/:event_id', authMiddle.isAuthenticated, function(req, res) {
    
    logger.info('Processing request to delete a single event specified by id %s', req.params.event_id);
    
    models.Event.remove({_id: req.params.event_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting event');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json({ 
            success: true,
            message: 'Event successfully deleted' 
        });
    });
});


module.exports = router;