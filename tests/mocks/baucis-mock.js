'use strict';

const sinon = require('sinon');

module.exports = {
    rest: sinon.stub().returns({query: sinon.spy()})
};
