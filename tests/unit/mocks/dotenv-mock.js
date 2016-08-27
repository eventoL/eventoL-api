'use strict';

const should = require('should');

module.exports = {
  load: () => {
    process.env.NODE_ENV = 'develop';
    process.env.LOGGER_INFO_PATH = '/var/log/couchdbOdooTaskInfo.log';
    process.env.LOGGER_ERROR_PATH = '/var/log/couchdbOdooTaskError.log';
    process.env.DOCS_IN_PAGE = '10';
    process.env.DEFAULT_PAGE = '1';
    process.env.DISTANCE = '10';
    process.env.PORT = '3000';
    process.env.HOST = '0.0.0.0';
    process.env.MONGO_HOST = 'localhost';
    process.env.MONGO_PORT = '27017';
    process.env.MONGO_DBNAME = 'eventoL';
    process.env.API_URL = 'http://localhost:3000';
  }
};
