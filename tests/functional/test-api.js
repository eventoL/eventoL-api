'use strict';

const should = require('should');
const Q = require('q');
const request = require('request');

function testRequest(url) {
    let deferred = Q.defer();
    request(url, (err, response) => (err) ? deferred.reject(err) : deferred.resolve(response));
    return deferred.promise;
}

describe('Api', () => {
    let apiUrl = process.env.API_URL;

    before(() => {
        //load example to db
        let db = require('./load-db');
        let main = require('../../main');
        return db.load();
    });

    beforeEach(() => {});

    describe('baucis get elements', () => {

        it('should be return 2 events in /api/events', () => {
            let url = `${apiUrl}/api/events/`;
            return testRequest(url).then((response) => {
                JSON.parse(response.body).length.should.be.equal(2);
            });
        });

        it('should be return 2 categories in /api/categories', () => {
            let url = `${apiUrl}/api/categories/`;
            return testRequest(url).then((response) => {
                JSON.parse(response.body).length.should.be.equal(2);
            });
        });

        it('should be return 2 tags in /api/tags', () => {
            let url = `${apiUrl}/api/tags/`;
            return testRequest(url).then((response) => {
                JSON.parse(response.body).length.should.be.equal(2);
            });
        });

        it('should be return 2 users in /api/users', () => {
            let url = `${apiUrl}/api/users/`;
            return testRequest(url).then((response) => {
                JSON.parse(response.body).length.should.be.equal(2);
            });
        });

    });

    describe('Search by tests', () => {

        it('should return event flisol by title when search flisol', () => {
            let text = 'flisol';
            let url = `${apiUrl}/api/events/search/${text}/`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.title.results.length.should.be.equal(1);
                body.title.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return event flisol by title when search fli', () => {
            let text = 'fli';
            let url = `${apiUrl}/api/events/search/${text}/`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.title.results.length.should.be.equal(1);
                body.title.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return event flisol by tag when search flisol', () => {
            let text = 'flisol';
            let url = `${apiUrl}/api/events/search/${text}/`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.tags.results.length.should.be.equal(1);
                body.tags.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return event flisol by tag when search sol', () => {
            let text = 'sol';
            let url = `${apiUrl}/api/events/search/${text}/`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.tags.results.length.should.be.equal(1);
                body.tags.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return event flisol by category when search linux', () => {
            let text = 'linux';
            let url = `${apiUrl}/api/events/search/${text}/`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.categories.results.length.should.be.equal(1);
                body.categories.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return event flisol by category when search nux', () => {
            let text = 'nux';
            let url = `${apiUrl}/api/events/search/${text}/`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.categories.results.length.should.be.equal(1);
                body.categories.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return event flisol and event cafeconf by tag when search flisol', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.tags.results.length.should.be.equal(2);
            });
        });

        it('should return event flisol and event cafeconf by tag when search soft', () => {
            let text = 'soft';
            let url = `${apiUrl}/api/events/search/${text}/`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.tags.results.length.should.be.equal(2);
            });
        });

        it('should return only event flisol by tag when search soft with limit=1', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/?limit=1`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.tags.results.length.should.be.equal(1);
                body.tags.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return only event cafeconf by tag when search soft with limit=1 and page=2', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/?limit=1&page=2`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.tags.results.length.should.be.equal(1);
                body.tags.results[0].title.should.be.equal('cafeconf');
            });
        });

        it('should use limit in tag when limit=1 in query params', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/?limit=1`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.tags.limit.should.be.equal(1);
            });
        });

        it('should use limit in categories when limit=1 in query params', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/?limit=1`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.categories.limit.should.be.equal(1);
            });
        });

        it('should use limit in title when limit=1 in query params', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/?limit=1`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.title.limit.should.be.equal(1);
            });
        });

        it('should use page in tag when page=2 in query params', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/?page=2`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.tags.page.should.be.equal(2);
            });
        });

        it('should use page in categories when page=2 in query params', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/?page=2`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.categories.page.should.be.equal(2);
            });
        });

        it('should use page in title when page=2 in query params', () => {
            let text = 'software';
            let url = `${apiUrl}/api/events/search/${text}/?page=2`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.title.page.should.be.equal(2);
            });
        });
        
    });

    describe('Search by tests', () => {
        let urlWithLatAndLong = `${apiUrl}/api/events/-60.390069/-34.604156/`;
        let distance = 184100;
        let distance2 = 484100;

        it('should return event flisol when distance param is correct', () => {
            let url = `${urlWithLatAndLong}?distance=${distance}`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.results.length.should.be.equal(1);
                body.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return event flisol and event cafeconf when distance param is correct', () => {
            let url = `${urlWithLatAndLong}?distance=${distance2}`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.results.length.should.be.equal(2);
                body.results[0].title.should.be.equal('flisol');
                body.results[1].title.should.be.equal('cafeconf');
            });
        });

        it('should not return event when distance param not set', () => {
            return testRequest(urlWithLatAndLong).then((response) => {
                let body = JSON.parse(response.body);
                body.results.length.should.be.equal(0);
            });
        });

        it('should return only event flisol when distance param is correct and limit=1', () => {
            let url = `${urlWithLatAndLong}?distance=${distance2}&limit=1`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.results.length.should.be.equal(1);
                body.results[0].title.should.be.equal('flisol');
            });
        });

        it('should return only event flisol when distance param is correct and limit=1 and page=2', () => {
            let url = `${urlWithLatAndLong}?distance=${distance2}&limit=1&page=2`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.results.length.should.be.equal(1);
                body.results[0].title.should.be.equal('cafeconf');
            });
        });

        it('should use limit when limit=1 in query params', () => {
            let url = `${urlWithLatAndLong}?limit=1`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.limit.should.be.equal(1);
            });
        });

        it('should use page in title when page=2 in query params', () => {
            let text = 'software';
            let url = `${urlWithLatAndLong}?page=2`;
            return testRequest(url).then((response) => {
                let body = JSON.parse(response.body);
                body.page.should.be.equal(2);
            });
        });

    });

});
