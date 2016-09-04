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
        let tags = docs[0];
        let categories = docs[1];
        let users = docs[2];
        let events = db.events.map((event) => {
            event.tags = event.tags.map((tagname) => tags.filter((tag) => tag.name === tagname)[0]);
            event.categories = event.categories.map((catname) => categories.filter((cat) => cat.name === catname)[0]);
            event.owner = users.filter((user) => user.username === event.owner)[0];
            return event;
        });
        return loadDocs(api.model.models.Event, events);
    });
}

module.exports = {
    load
};
