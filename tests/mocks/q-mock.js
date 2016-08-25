'use strict';

const sinon = require('sinon');
const Q = require('q');

module.exports = {
    Promise: {},
    all: sinon.stub().returns(Q())
};