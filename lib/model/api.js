'use strict';

require('dotenv').load();
const model = require('./model');
const baucis = require('baucis');

function populateRelationship(populateModel, query) {
    let schemaTree = populateModel.schema.tree;
    let relationships = Object.keys(schemaTree).filter((key) => schemaTree[key].hasOwnProperty('populate'));
    relationships
        .filter((relsip) => schemaTree[relsip].populate)
        .forEach((populate) => {
            query = query.populate(populate);
        });
    relationships
        .filter((relsip) => !schemaTree[relsip].populate)
        .forEach((populate) => {
            query = query.populate(populate, 'url');
        });
    return query;
}

function register(newModel) {
    let controller = baucis.rest(newModel.modelName);
    controller.query((request, response, next) => {
        request.baucis.query = populateRelationship(newModel, request.baucis.query);
        next();
    });
    newModel.schema.post('init', (doc) => {
        doc.url = `${process.env.API_URL}/api/${newModel.plural()}/${doc._id}`;
    });
}

function load() {
    Object.keys(model.models).forEach((key) => register(model.models[key]));
}

function execQuery(queryModel, query, page, limit) {
    /* eslint {no-param-reassign:0} */
    page = parseInt(page || process.env.DEFAULT_PAGE);
    limit = parseInt(limit || process.env.DOCS_IN_PAGE);
    let skip = limit * (page - 1);
    let promise = queryModel.find(query).skip(skip).limit(limit);
    promise = populateRelationship(model.models.Event, promise);
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
    register,
    execQuery,
    getEventForRelationship,
    populateRelationship,
    load
};
