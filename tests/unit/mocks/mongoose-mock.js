'use strict';

const sinon = require('sinon');

function Schema(schema) {
    return schema;
}
Schema.Types = {ObjectId: sinon.spy()};

module.exports = {
    connect: sinon.spy(),
    Schema,
    Promise: {},
    model: sinon.spy()
};
