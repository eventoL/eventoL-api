'use strict';

require('dotenv').load();
const logger = require('./lib/logger');
const express = require('express');
const api = require('./lib/model/api');

// Create the app and listen for API requests
let app = express();

app.get('/events/:long/:lat/', (req, res) => {
    let page = parseInt(req.query.page || process.env.DEFAULT_PAGE);
    let limit = parseInt(req.query.limit || process.env.DOCS_IN_PAGE);
    let distance = parseFloat(req.query.distance || process.env.DISTANCE);
    let cords = [parseFloat(req.params.long), parseFloat(req.params.lat)];
    let skip = limit * (page - 1);
    let query = {location: {$near: {$geometry: {type: 'Point', coordinates: cords}, $maxDistance: distance}}};
    api.model.Event
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec((err, events) => (err) ? res.status(500).json(err) : res.status(200).json(events));
});
app.use('/', api.baucis());

app.listen(3000);
