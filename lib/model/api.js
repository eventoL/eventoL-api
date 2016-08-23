'use strict';

const model = require('./model');
const baucis = require('baucis');

// Create a simple controller.  By default these HTTP methods
// are activated: HEAD, GET, POST, PUT, DELETE
baucis.rest('tag');
baucis.rest('category');
baucis.rest('user');
baucis.rest('event');

module.exports = {
    baucis,
    model
};
