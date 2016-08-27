'use strict';

const should = require('should');
const winston = require('winston');
const proxyquire =  require('proxyquire').noCallThru();

describe('Logger', () => {
  let logger;
  let dotenvStub = {load: undefined};

  describe('in develop', () => {

    beforeEach(() => {
      dotenvStub.load = () => {process.env.NODE_ENV='develop'};
      logger = proxyquire('../../lib/logger', {'dotenv': dotenvStub});
    });

    it('should be a instance of winston.Logger', () => {
      logger.should.be.an.instanceOf(winston.Logger);
    });

    describe('trasports', () => {

      it('should exist a console trasports', () => {
        logger.transports.console.should.not.be.equal(undefined);
      });

    });

  });

  describe('in production', () => {

    beforeEach(() => {
      dotenvStub.load = () => {
        process.env.NODE_ENV='production';
        process.env.LOGGER_INFO_PATH='/var/log/Info.log';
        process.env.LOGGER_ERROR_PATH='/var/log/Error.log'
      };
      logger = proxyquire('../../lib/logger', {'dotenv': dotenvStub});
    });

    it('should be a instance of winston.Logger', () => {
      logger.should.be.an.instanceOf(winston.Logger);
    });

    describe('trasports', () => {

      it('should exist a console trasports', () => {
        logger.transports.console.should.not.be.equal(undefined);
      });

      it('should exist a errorFile trasports', () => {
        logger.transports.errorFile.should.not.be.equal(undefined);
      });

      it('should exist a infoFile trasports', () => {
        logger.transports.infoFile.should.not.be.equal(undefined);
      });


    });

  });

});
