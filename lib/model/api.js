'use strict';

require('dotenv').load();
const model = require('./model');
const baucis = require('baucis');

// Create a simple controller.  By default these HTTP methods
// are activated: HEAD, GET, POST, PUT, DELETE
function register(model) {
    let controller = baucis.rest(model.modelName);
    controller.query((request, response, next) => {
        let populates = Object.keys(model.schema.tree).filter((key) => model.schema.tree[key].relationship);
        request.baucis.query.populate(populates);
        next();
    });
}
Object.keys(model.models).forEach((key) => register(model.models[key]));

function execQuery(queryModel, query, page, limit) {
    page = parseInt(page || process.env.DEFAULT_PAGE);
    limit = parseInt(limit || process.env.DOCS_IN_PAGE);
    let skip = limit * (page - 1);
    let populates = Object.keys(model.models.Event.schema.tree)
        .filter((key) => model.models.Event.schema.tree[key].relationship);
    let promise = queryModel.find(query).skip(skip).limit(limit).populate(populates);
    return promise.exec().then((docs) => {
        return {limit, page, results: docs};
    });
}

function getEventForRelationship(relationModel, attr, query, page, limit) {
    return relationModel
        .find(query)
        .exec()
        .then((docs) => {
            let eventQuery = {};
            eventQuery[attr] = {$in: docs};
            return execQuery(model.models.Event, eventQuery, page, limit);
        });
}

module.exports = {
    baucis,
    model,
    execQuery,
    getEventForRelationship
};
