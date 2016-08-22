'use strict';

require('dotenv').load();
const winston = require('winston');
var logger;

if(process.env.NODE_ENV === 'production') {
    logger = new (winston.Logger)({
        transports : [
            new (winston.transports.Console)({timestamp: true, colorize: true, level: 'debug', handleExceptions: true}),
            new (winston.transports.File)({name: 'infoFile', filename: process.env.LOGGER_INFO_PATH, level: 'info'}),
            new (winston.transports.File)({name: 'errorFile', filename: process.env.LOGGER_ERROR_PATH, level: 'error'})
        ],
        exitOnError: false
    });
} else {
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({timestamp: true, colorize: true, level: 'debug'})
        ]
    });
}

module.exports = logger;
