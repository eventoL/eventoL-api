'use strict';

const logger = require('../../lib/logger');
const api = require('../../lib/model/api');
const Q = require('q');

function loadDoc(model, doc) {
    let deferred = Q.defer();
    model.remove((error) => {
        if (error) {
            return deferred.reject(error);
        }
        return model.create(doc, (err, result) => (err) ? deferred.reject(err) : deferred.resolve(result));
    });
    return deferred.promise;
}

function loadDocs(model, docs) {
    return Q.all(docs.map((doc) => loadDoc(model, doc)));
}

function load() {
    api.load();
    let db = require('./db.json');
    return Q.all([
        loadDocs(api.model.models.Tag, db.tags),
        loadDocs(api.model.models.Category, db.categories),
        loadDocs(api.model.models.User, db.users)
    ]).then((docs) => {
        db.events[0].tags = docs[0];
        db.events[1].tags.push(docs[0][1]);
        db.events[0].categories.push(docs[1][0]);
        db.events[1].categories.push(docs[1][1]);
        db.events[0].owner = docs[2][0];
        db.events[1].owner = docs[2][1];
        return loadDocs(api.model.models.Event, [db.events]);
    });
}

module.exports = {
    load
};
