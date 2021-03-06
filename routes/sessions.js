// ROUTES FOR OUR API/SETUP
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/session.js');
var jwt        = require('jsonwebtoken');
var config     = require('../config');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');
var moment      = require('moment');
//        require('datejs');

var superSecret = config.secret;

var env = config.node_env;

// get the next session (accessed at GET http://localhost:8082/api/sessions/next)
router.get('/next', function(req, res) {

    logger.info('Processing api request to get the next session');
	
    //Will get only the row we want based on the date
    //models.Session.find({ sessionDate: todayNoTime }, function(err, session) {
    var todayWithTime = new Date();
    var today = new Date(todayWithTime.getFullYear(), todayWithTime.getMonth(), todayWithTime.getDate()).toISOString();


    //var offset = new Date().getTimezoneOffset();
    //offset = offset *-1;
    //logger.info('offset %s', offset);

    //Find all stored sessions greater than or equal to today
    models.Session.find()
      //.where('cancelled').equals(true)
      .where('sessionDate').gte(today)
      .exec(function(err,session) {
        
        if (err) {
            logger.error('Error next sessions');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        var sessionFree = false;
        var nextFriday = new Date.today();
        var nextAvailableFriday;
        var fridayCount = 0;
        var sessionData = new Object();

        sessionData.nextActualFridayCancelled = false;
        sessionData.running = false;
        sessionData.shooting = false;
        sessionData.fencing = false;

        //Set to Friday as a search filter
        var weekDayToFind = moment().day('Friday').weekday();
                
        logger.info('Starting to calculate the next free Friday');

        nextAvailableFriday = moment(nextFriday);

        logger.info('n f utc %s',moment.utc(nextFriday).format("YYYY-MM-DD HH:mm"));

//**************************** TEST ************************************/
//while (nextAvailableFriday.weekday() !== weekDayToFind){ 
//    nextAvailableFriday.add(1, 'day'); 
//}
//nextAvailableFriday.add(1, 'day'); 
//**************************** TEST ************************************/
/*
Solution. Store dates with 12:00 time. Now any hour difference will not matter
Strip time off for comparrison and returning back to the client.
Perhaps format('YYYYMMDD') and compare dates as strings rather than dates.
This should solve the problem
*/



        //Loop until you can find a non cancelled future Friday including today if today is Friday
        do {
            fridayCount = fridayCount + 1;

            //Dont advance to next friday if today is friday.
            if ((fridayCount === 1) && (nextAvailableFriday.weekday() === weekDayToFind)) {

                logger.info('today is already friday so dont advance to next week');

            } else {
                logger.info('Advance to next friday');
                //Advance to next friday
                nextAvailableFriday.add(1, 'day'); 
                while (nextAvailableFriday.weekday() !== weekDayToFind){ 
                    nextAvailableFriday.add(1, 'day'); 
                }

                logger.info('Moment Just calculated next avail friday to be %s', nextAvailableFriday.format("YYYY-MM-DD HH:mm"));
            }

            //Record this fridays date if it has been cancelled. This is then returned in the reponse for consumption 
            //in the client
            if (fridayCount === 1) {
                var nFriday = new Date(nextAvailableFriday);
                sessionData.nextActualFriday = nFriday.toDateString();
                logger.info('sessionData.nextActualFriday %s', sessionData.nextActualFriday);
            }

            sessionFree = true;
            //logger.info('next fri is %s', moment(nextAvailableFriday).format("YYYY-MM-DD HH:mm"));

            if (session != undefined) {
                
                logger.info('Number of stored sessions %s', session.length);
                
                for (var i = 0; i < session.length; i++) {

                    //logger.info('raw date %s', session[i].sessionDate.toISOString());
                    //logger.info('raw nextavail %s', nextAvailableFriday.format("YYYY-MM-DD HH:mm"));

                    var dbDate = moment(session[i].sessionDate).format('YYYYMMDD').toString();
                    var nextFri = moment(nextAvailableFriday).format('YYYYMMDD').toString();
                    var storedDate = new Date(session[i].sessionDate);
                    
                    logger.info('session %d storedDate %s nextFri %s', i, dbDate, nextFri );

                    //Is next Fri the same date as the one found in the database
                    //var sameDate = moment(storedDate).isSame(nextAvailableFriday);

                    //if (sameDate) {
                    if (dbDate === nextFri) {
                    
                        
                        //logger.info('session %d is next friday  %s', i, storedDate.format("YYYY-MM-DD HH:mm"));
                        logger.info('session %d is next friday  %s', i, storedDate.toDateString());

                        //If next friday if found in the db then collect the settings
                        if (fridayCount === 1) {
                            logger.info('Collecting seettings for next friday');
                            sessionData.running = session[i].running;
                            sessionData.shooting = session[i].shooting;
                            sessionData.fencing = session[i].fencing;        
                        }
                        
                        if (session[i].running === true && session[i].shooting === true && session[i].fencing === true) {

                            sessionFree = false;  
                            logger.info('That session is cancelled');

                            if (fridayCount === 1) {
                                sessionData.nextActualFridayCancelled = true;
                            }
                        }
                    }
                }
            }
            else {
                logger.info('No cancelled sessions found');
            }
        }
        while (sessionFree == false);

        var nAvaiFriday = new Date(nextAvailableFriday);
        sessionData.nextAvailableFriday = nAvaiFriday.toDateString();
        
        logger.info('nextActualFriday %s', sessionData.nextActualFriday);
        logger.info('nextAvailableFriday %s', sessionData.nextAvailableFriday);
        logger.info('Returning running %s', sessionData.running);
        logger.info('Returning shooting %s', sessionData.shooting);
        logger.info('Returning fencing %s', sessionData.fencing);

        res.json(sessionData);
        
    });
});

/*
// get the next session (accessed at GET http://localhost:8082/api/sessions/next)
router.get('/next', function(req, res) {

    logger.info('Processing api request to get the next session');
	
    //Will get only the row we want based on the date
    //models.Session.find({ sessionDate: todayNoTime }, function(err, session) {
    var todayWithTime = new Date();
    var today = new Date(todayWithTime.getFullYear(), todayWithTime.getMonth(), todayWithTime.getDate()).toISOString();
    
    //Find all stored sessions greater than or equal to today
    models.Session.find()
      //.where('cancelled').equals(true)
      .where('sessionDate').gte(today)
      .exec(function(err,session) {
        
        if (err) {
            logger.error('Error next sessions');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        var sessionFree = false;
        var nextFriday = new Date.today();
        var nextAvailableFriday;
        var fridayCount = 0;
        var sessionData = new Object();

        sessionData.nextActualFridayCancelled = false;
        sessionData.running = false;
        sessionData.shooting = false;
        sessionData.fencing = false;

        logger.info('Starting to calculate the next free Friday');
        //console.log('datejs next Friday ' + Date.today().next().friday());

        //Loop until you can find a non cancelled future Friday including today if today is Friday
        do {
            //console.log('start of loop nextFriday  ' + nextFriday);
            fridayCount = fridayCount + 1;

            //Dont advance to next friday if today is friday.
            if ((fridayCount === 1) && (Date.parse(nextFriday).is().friday())) {

                logger.info('today is already friday so dont advance to next week');
                nextAvailableFriday = nextFriday;

            } else {
                logger.info('Advance to next friday');
                //Advance to next friday
                Date.parse(nextFriday).next().friday();
                nextAvailableFriday = nextFriday;
            }

            //Record this fridays date if it has been cancelled. This is then returned in the reponse for consumption 
            //in the client
            if (fridayCount === 1) {
                sessionData.nextActualFriday = nextAvailableFriday.toDateString();
            }

            logger.info('Just calculated next friday to be %s', nextAvailableFriday);

            logger.info('back from iso to local %s', new Date(nextAvailableFriday.toISOString()));
            sessionFree = true;


            if (session != undefined) {
                
                logger.info('Number of stored sessions %s', session.length);
                
                for (var i = 0; i < session.length; i++) {

                    var storedDate = new Date(session[i].sessionDate)
                    //console.log('session ' + i + ' date ' + session[i].sessionDate.toISOString())
                    //logger.info('session %d date %s', i,session[i].sessionDate.toISOString());
                    logger.info('session %d storedDate %s', i, storedDate);

                    var span = new TimeSpan(storedDate - nextAvailableFriday);
                    logger.info('span %d', span);


                    if (storedDate == nextAvailableFriday) {
                    //if (session[i].sessionDate.toISOString() === nextAvailableFriday.toISOString()) { 
                        
                        logger.info('session %d is next friday  %s', i, storedDate);

                        //If next friday if found in the db then collect the settings
                        if (fridayCount === 1) {
                            logger.info('Collecting seettings for next friday');
                            sessionData.running = session[i].running;
                            sessionData.shooting = session[i].shooting;
                            sessionData.fencing = session[i].fencing;        
                        }
                        
                        
                        if (session[i].running === true && session[i].shooting === true && session[i].fencing === true) {

                            sessionFree = false;  
                            logger.info('That session is cancelled');

                            if (fridayCount === 1) {
                                sessionData.nextActualFridayCancelled = true;
                            }
                        }
                        /*} else {
                            //This Friday is available so must return its values
                            sessionData.running = session[i].running;
                            sessionData.shooting = session[i].shooting;
                            sessionData.fencing = session[i].fencing;    
                    }*/

/*                    
                    }
                }
            }
            else {
                logger.info('No cancelled sessions found');
            }
        }
        while (sessionFree == false);

        sessionData.nextAvailableFriday = nextAvailableFriday.toDateString();
        
        logger.info('nextActualFriday %s', sessionData.nextActualFriday);
        logger.info('nextAvailableFriday %s', nextAvailableFriday);
        logger.info('Returning running %s', sessionData.running);
        logger.info('Returning shooting %s', sessionData.shooting);
        logger.info('Returning fencing %s', sessionData.fencing);

        res.json(sessionData);
        
    });
});
*/

// get all the Sessions (accessed at GET http://localhost:8082/api/sessions)
router.get('/', authMiddle.isAuthenticated, function(req, res) {

    logger.info('Processing api request to get all the sessions');
        
    models.Session.find()
    .sort({'sessionDate': 'desc'})
    .exec(function(err,sessions) {        
        
        if (err) {
            logger.error('Error getting all sessions');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json(sessions);
    });
});

// get a single session (accessed at GET http://localhost:8082/api/sessions/:session_id)
router.get('/:session_id', authMiddle.isAuthenticated, function(req, res) {

    logger.info('Processing request to get a single session specified by id %s',req.params.session_id);
    
    if (req.params.session_id === undefined) {
        return res.json({ success: false, message: 'No session_id specified'});
    }
    
    models.Session.findById(req.params.session_id, function(err, session) {
    
        if (err) {
            logger.error('Error getting the session schema for session_id %s', req.params.session_id);

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }        
        
        // return that session
        res.json(session);
    });
});


//Adding a session entry (accessed at POST http://localhost:8082/api/sessions)
router.post('/',authMiddle.isAuthenticated, function(req, res) {
  
    logger.info('Received a request to add a XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX session req.body.sessionDate %s', req.body.sessionDate);

    //VALIDATION
    if (!req.body.sessionDate) {
        return res.json({ success: false, message: 'No sessionDate specified'});
    }

    //Add 12 hours onto date
    var newDate = moment.utc(req.body.sessionDate).add('12','hours');

    //moment.utc(newDate).add('hours',9).format('DD-MM-YYYY HH:mm:ss');
    logger.info('newDate %s',newDate.format());
    logger.info('plus hours %s',moment.utc(newDate).add('12','hours').format('DD-MM-YYYY HH:mm:ss'));
    
    var session = new models.Session();      // create a new instance of the Session model
    session.sessionDate = new Date(newDate).toISOString(),
    session.running = req.body.running;  
    session.shooting = req.body.shooting;  
    session.fencing = req.body.fencing;  
    
    logger.info('req.body.running %s', req.body.running);
    
    // save the session and check for errors
    session.save(function(err) {
        
        if (err) {
            
            if (err.code == 11000) {
                logger.info('That session date already exists %s', req.body.sessionDate);
                return res.json({ success: false, message: 'That session date already exists.'});
            }

            logger.error('Error adding session');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        logger.info('Session successfully created sessionid %s', session._id);

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Session Created'
        });
    });        
});



// update the session with this id (accessed at PUT http://localhost:8080/api/sessions/:session_id)
router.put('/:session_id', authMiddle.isAuthenticated, function(req, res) {
    
    //******************** test *****************************/
    //logger.remove(winston.transports.Console);
    //******************** test *****************************/
    
    logger.info('Processing request to update a single session specified by id %s', req.params.session_id);

    models.Session.findById(req.params.session_id , function(err, session) {

        if (err) {
            logger.error('Error getting session %s', req.params.session_id);
            responses.handleError(err,req,res);   
            
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        logger.info('Found session');
        logger.info('running = %s', req.body.running);
        
        if (req.body.sessionDate){
            session.sessionDate = new Date(req.body.sessionDate).toISOString();
        };

        session.running = req.body.running;
        session.shooting = req.body.shooting;
        session.fencing = req.body.fencing;
        
        logger.info('About to save the session schema');
        // save the user
        session.save(function(err) {
            
            if (err) {
                logger.error('Error saving session %s', req.params.session_id);

                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }

            // return a message
            res.json({ 
                success: true,
                message: 'Session updated!' 
            });
        });        
    });            
});


// delete the session with this id (accessed at DELETE http://localhost:8080/api/sessions/:session_id)
router.delete('/:session_id', authMiddle.isAuthenticated, function(req, res) {
    
    logger.info('Processing request to delete a single session specified by id %s', req.params.session_id);
    
    models.Session.remove({_id: req.params.session_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting session %s', req.params.session_id);

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json({ 
            success: true,
            message: 'Session successfully deleted' 
        });
    });
});


module.exports = router;