'use strict';

const logger = require('./lib/logger');
const api = require('./lib/model/api');
api.load();

function generateModel(model, docs, callback){
    docs.forEach((doc) => {
        model.remove((error) => {
            if (error) {
                throw console.log(error);
            }
            model.create(doc, (err, result) => {
                if (err) {
                    throw console.log(err);
                }
                console.log(result);
                if (callback) {
                    callback(result);
                }
            });
        });
    });
}

let event = {
    title: 'flisol',
    description: 'lkasjdlaskjlaskjlaskjlkasjlaskjdaslkj laksdj lksa jlkas nlkn a',
    owner: '',
    tags: [],
    categories: [],
    location: [-58.381559, -34.603684]
};

generateModel(api.model.models.Tag, [{name: 'flisol'}, {name: 'software libre'}], (id) => event.tags.push(id));
generateModel(api.model.models.Category, [{name: 'linux'}], (id) => event.categories.push(id));
generateModel(api.model.models.User, [{
    first_name: 'pepe',
    last_name: 'gomez',
    username: 'pgomez'
}], (id) => {
    event.owner = id;
});
setTimeout(() => generateModel(api.model.models.Event, [event]), 3000);
