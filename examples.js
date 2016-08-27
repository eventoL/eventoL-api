'use strict';

const logger = require('./lib/logger');
const load_db = require('./tests/functional/load-db');

load_db.load().then(() => logger.info('All documents loader in db'));
