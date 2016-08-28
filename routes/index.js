// ROUTES FOR OUR API
// =============================================================================
//Define the route files. These have been split up by function
module.exports = function(app) {
    app.use('/api', require('./main.js'));
    app.use('/api/taster', require('./taster.js'));
    app.use('/api/authenticate', require('./authenticate.js'));
    app.use('/api/users', require('./users.js'));
    app.use('/api/me', require('./me.js'));
    app.use('/api/sessions', require('./sessions.js'));
    app.use('/api/events', require('./events.js'));
    app.use('/api/contactUsers', require('./contactUsers.js'));
    app.use('/api/home', require('./home.js'));
    app.use('/api/forgot', require('./forgot.js'));
    app.use('/reset', require('./reset.js'));
};