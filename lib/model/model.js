'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to the Mongo instance
mongoose.connect('mongodb://localhost:27017/eventoL');

// Create a mongoose schema.
let UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: {type: String, index: true}
});
let TagSchema = new mongoose.Schema({
    name: {type: String, index: true}
});
let CategorySchema = new mongoose.Schema({
    name: {type: String, index: true}
});
let EventSchema = new mongoose.Schema({
    title: {type: String, index: true},
    description: String,
    owner: {type: Schema.Types.ObjectId, ref: 'event'},
    tags: [{type: Schema.Types.ObjectId, ref: 'tag'}],
    categories: [{type: Schema.Types.ObjectId, ref: 'category'}],
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
    Event,
    User,
    Category,
    Tag,
    mongoose
};
