'use strict';

require('dotenv').load();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to the Mongo instance
mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`);
mongoose.Promise = require('q').Promise;

// Create a mongoose schema.
let UserSchema = new mongoose.Schema({
    url: String,
    first_name: String,
    last_name: String,
    username: {type: String, index: true}
});
let TagSchema = new mongoose.Schema({
    url: String,
    name: {type: String, index: true}
});
let CategorySchema = new mongoose.Schema({
    url: String,
    name: {type: String, index: true}
});
let EventSchema = new mongoose.Schema({
    url: String,
    title: {type: String, index: true},
    description: {type: String, index: true},
    owner: {type: Schema.Types.ObjectId, ref: 'user', 'populate': true},
    tags: {type: [{type: Schema.Types.ObjectId, ref: 'tag'}], 'populate': true},
    categories: {type: [{type: Schema.Types.ObjectId, ref: 'category'}], 'populate': true},
    location: {
        type: [Number],
        index: '2dsphere'
    }
});

// Register new models with mongoose.
let Event = mongoose.model('event', EventSchema);
let User = mongoose.model('user', UserSchema);
let Category = mongoose.model('category', CategorySchema);
let Tag = mongoose.model('tag', TagSchema);

module.exports = {
    models: {
        Event,
        User,
        Category,
        Tag
    },
    schemas: {
        UserSchema,
        TagSchema,
        CategorySchema,
        EventSchema
    },
    mongoose
};
