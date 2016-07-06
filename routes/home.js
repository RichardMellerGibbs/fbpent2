// ROUTES FOR OUR HOME API
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/home.js');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');
        require('datejs');


// get all the home data (accessed at GET http://localhost:8082/api/home)
router.get('/', function(req, res) {

    logger.info('Processing api request to get all the home data');
        
    models.Home.find()
    .sort({'name': 'asc'})
    .exec(function(err, home) {        
        
        if (err) {
            logger.error('Error getting all home data');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        if (home.length === 0) {
            logger.info('no home data found');
            //No data found. Populate base data for a new instance of the database.
            
            var homeData = [
                {
                    name: 'diciplineTitle',
                    title: 'NA',
                    description: 'Five diciplines originally designed to demonstrate core military skills including the most noble of sports Fencing and Shooting'
                },
                {
                    name: 'dicipline1',
                    title: 'swimming',
                    description: 'Lessons and coaching sessions are organised inline with the regional Triathlon competions'
                },
                {
                    name: 'dicipline2',
                    title: 'running',
                    description: 'Training sessions take place each week with qualified running coaches'
                },
                {
                    name: 'dicipline3',
                    title: 'shooting',
                    description: 'Both Air and Lazer Pistol shooting training with three dedicated coaches'
                },
                {
                    name: 'dicipline4',
                    title: 'fencing',
                    description: 'Led by the former director of fencing coaching for the UK. Alan Skipp'
                },
                {
                    name: 'dicipline5',
                    title: 'riding',
                    description: 'Riding lessons are organised in conjunction with the Pony club'
                },
                {
                    name: 'weeklyTrainTitle',
                    title: 'NA',
                    description: 'Training takes place on Friday evenings. Three hourly diciplines are covered starting at 6pm'
                },
                {
                    name: 'weeklyTrain1',
                    title: 'Running 6pm - 7pm',
                    description: 'The leisure centre provides a flood lit athlectics track and training focuses on building strength and stamina suitable for all multisport events including Triathlons'
                },
                {
                    name: 'weeklyTrain2',
                    title: 'Running 7pm - 8pm',
                    description: 'The highly organised 10 meter shooting range is available in the leisure center gym. Both air pistol and new newly introduced Lazer pistols are available'
                },
                {
                    name: 'weeklyTrain3',
                    title: 'Running 8pm - 9pm',
                    description: 'Adjcent to the shooring range is the fencing gym. Run by two highly experienced naional coaches the quality of training is extremely high and all althlets enjoy the light hearted yet committed approach to the sport'
                },
                {
                    name: 'runCoach1',
                    title: 'Kelly Haywood',
                    description: 'Kelly has coached with Newark Athletics and is now the lead coach for Pentathlon. She is a great run technician and has a keen eye for detail'
                },
                {
                    name: 'runCoach2',
                    title: 'Robert Evans',
                    description: 'Previously a track cyclist, marathon runner and all-round fitness fanatic. He has been coaching running and shooting for Pony Club Tetrathlon for several years'
                },
                {
                    name: 'shootCoach1',
                    title: 'Paul Hooper',
                    description: 'Club founder and Chairman, Paul is a qualified instructor and Range Officer. He has experience in teaching shooting at Pony Club training sessions'
                },
                {
                    name: 'shootCoach2',
                    title: 'Dave Hallam',
                    description: 'Dave Hallam has vast experience in teaching pistol shooting. Always popular with our youngest shooters, Dave has the patience and experience to introduce youngsters to the sport. A qualified Club Instructor and Range Officer'
                },
                {
                    name: 'fenceCoach1',
                    title: 'Alan Skipp',
                    description: 'Former Director of Coaching for British Fencing and club lead Fencing Coach. Alan has immence experience in coaching structure and makes the learning experience fun and exciting from beginners through to International fencers'
                },
                {
                    name: 'fenceCoach2',
                    title: 'Sam Boyle',
                    description: 'Actively competing for Great Britain achiving Team bronze at the 2015 Commonwealth Games. He is the assistant Coach and at 21 years he’s a great role model to inspire your year 7s to year 13s and adults'
                },
                {
                    name: 'tasterTitle',
                    title: 'NA',
                    description: 'The club trains every Friday 6-9pm. If you would like to book a taster session to try one or all of the disiplines then please complete the form below'
                }
            ];
            
            var home = new models.Home();
            
            home.collection.insert(homeData, function(err) {
        
                if (err) {

                    logger.error('Error adding home enties');
                    responses.handleError(err,req,res);   
                    return res.json({ success: false, message: 'Internal server error'});
                }

                logger.info('Home enties successfully created');

                // return the information including token as JSON
                res.json(homeData);
            });

            
        } else {
            res.json(home);
        }
    });
});

// update the home page entry with this id (accessed at PUT http://localhost:8080/api/home/:home_id)
//
router.put('/:home_id', authMiddle.isAuthenticated,  function(req, res) {
 
    logger.info('Processing request to update home page data');

    models.Home.findById(req.params.home_id , function(err, home) {

        if (err) {
            logger.error('Error getting home entry %s', req.params.home_id);

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        logger.info('Found home entry %s', req.params.home_id);
        logger.info('Description %s', req.params.description);
        logger.info('Title %s', req.params.title);
        
        if (req.body.description){
            logger.info('description is populated');
            home.description = req.body.description;
        }
        
        if (req.body.title){
            logger.info('title is populated');
            home.title = req.body.title;
        }
        
        if (req.body.name){
            logger.info('name is populated');
            home.name = req.body.name;
        }
        
        logger.info('About to save the home schema');
        // save the user
        home.save(function(err) {
            
            if (err) {
                logger.error('Error saving home entry');

                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }

            // return a message
            res.json({ 
                success: true,
                message: 'Home entry updated!' 
            });
        });        
    });            
});

//Adding a session entry (accessed at POST http://localhost:8082/api/home)
//authMiddle.isAuthenticated,
router.post('/', authMiddle.isAuthenticated, function(req, res) {
  
    logger.info('Received a request to add a home entry');
    
    //VALIDATION
    if (!req.body.name) {
        return res.json({ success: false, message: 'No name specified'});
    }
    
    if (!req.body.description) {
        return res.json({ success: false, message: 'No description specified'});
    }
    
    if (!req.body.title) {
        return res.json({ success: false, message: 'No title specified'});
    }
    
    
    var home = new models.Home();      // create a new instance of the Home model
    
    home.name = req.body.name;  
    home.description = req.body.description; 
    home.title = req.body.title; 
    
    logger.info('req.body.name %s', req.body.name);
    logger.info('req.body.description %s', req.body.description);
    logger.info('req.body.title %s', req.body.title);
    
    // save the session and check for errors
    home.save(function(err) {
        
        if (err) {

            logger.error('Error adding home entry');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        logger.info('Home entry successfully created home_id %s', home._id);

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Home entry created'
        });
    });        
});


// delete the event with this id (accessed at DELETE http://localhost:8080/api/events/:event_id)
//authMiddle.isAuthenticated,
router.delete('/:name', function(req, res) {
    
    logger.info('Processing request to delete a single event specified by id %s', req.params.event_id);
    
    models.Home.remove({name: req.params.name}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting home data');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json({ 
            success: true,
            message: 'Home data successfully deleted' 
        });
    });
});


module.exports = router;