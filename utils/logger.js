var winston = require('winston');

var winston = new (winston.Logger)({  
    
    transports: [
        /*new (winston.transports.Console)({
            level: 'debug' 
        }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: __dirname + '/../logs/pent_info.log', 
            level: 'info' 
        }),*/
        new (winston.transports.File)({ 
            name: 'error-file',
            filename: __dirname + '/../logs/pent_error.log', 
            level: 'error' 
        })
    ]   
});

//winston.info('Chill Winston, the logs are being captured 2 ways - console and file')

module.exports = winston; 