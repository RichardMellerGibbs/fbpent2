var config     = require('../config');
var env        = config.node_env;

const
    winston = require('winston'),
    transports = [
        new winston.transports.File({ 
            name: 'error-file',
            filename: __dirname + '/../logs/pent_error.log', 
            level: 'error' 
        })
    ];

    if (env == 'development') {

        transports.push(
            new (winston.transports.Console)({
                    level: 'debug' 
            })
        );

        transports.push(
            new (winston.transports.File)({
                name: 'info-file',
                filename: __dirname + '/../logs/pent_info.log', 
                level: 'info' 
            })
        );
    }

    const logger = new winston.Logger({
        transports
});

//winston.info('Chill Winston, the logs are being captured 2 ways - console and file')

module.exports = logger; 