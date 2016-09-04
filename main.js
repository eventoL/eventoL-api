'use strict';

require('dotenv').load();
const logger = require('./lib/logger');
const express = require('express');
const cors = require('cors');
const Q = require('q');

const api = require('./lib/model/api');
api.load();

// Create the app and listen for API requests
let app = express();
app.use(cors());

app.get('/api/events/search/:text/', (req, res) => {
    let redex = `.*${req.params.text}.*`;
    let page = req.query.page;
    let limit = req.query.limit;
    let redexQuery = {$regex: redex, $options: 'i'};
    let queryTitle = {$or: [
        {title: redexQuery},
        {description: redexQuery}
    ]};
    return Q.all([
        api.getEventForRelationship(api.model.models.Tag, 'tags', {name: redexQuery}, page, limit),
        api.getEventForRelationship(api.model.models.Category, 'categories', {name: redexQuery}, page, limit),
        api.execQuery(api.model.models.Event, queryTitle, page, limit)
    ])
        .then((querys) => {
            return {tags: querys[0], categories: querys[1], title: querys[2]};
        })
        .then((events) => res.status(200).json(events))
        .catch((err) => res.status(500).json(err));
});
app.get('/api/events/:long/:lat/', (req, res) => {
    let distance = parseFloat(req.query.distance || process.env.DISTANCE);
    let cords = [parseFloat(req.params.long), parseFloat(req.params.lat)];
    let query = {location: {$near: {$geometry: {type: 'Point', coordinates: cords}, $maxDistance: distance}}};
    return api.execQuery(api.model.models.Event, query, req.query.page, req.query.limit)
        .then((events) => res.status(200).json(events))
        .catch((err) => res.status(500).json(err));
});

app.use('/api', api.baucis());

app.listen(process.env.PORT, process.env.HOST, () => {
    logger.info(`eventoL-api listening on port ${process.env.PORT} and host ${process.env.HOST}`)
});
