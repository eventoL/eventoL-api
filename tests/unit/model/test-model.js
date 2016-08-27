'use strict';

const should = require('should');
const proxyquire =  require('proxyquire').noCallThru();
const mongooseStub = require('../mocks/mongoose-mock');
const qStub = require('../mocks/q-mock');
const dotenvStub = require('../mocks/dotenv-mock');

describe('Model', () => {
    let model;

    beforeEach(() => {
        model = proxyquire('../../lib/model/model', {
            'q': qStub,
            'dotenv': dotenvStub,
            'mongoose': mongooseStub
        });
    });

    describe('mongoose', () => {

        it('should be call mongoose.connect with correct url', () => {
            let url = 'mongodb://localhost:27017/eventoL';
            mongooseStub.connect.calledWithExactly(url).should.be.true();
        });

        it('should set promises to q.promise', () => {
            mongooseStub.Promise.should.be.equal(qStub.Promise);
        });

        describe('models', () => {

            it('should call model with EventSchema and event', () => {
                mongooseStub.model.calledWithExactly('event', model.schemas.EventSchema).should.be.true();
            });

            it('should call model with UserSchema and user', () => {
                mongooseStub.model.calledWithExactly('user', model.schemas.UserSchema).should.be.true();
            });

            it('should call model with TagSchema and tag', () => {
                mongooseStub.model.calledWithExactly('tag', model.schemas.TagSchema).should.be.true();
            });

            it('should call model with CategorySchema and category', () => {
                mongooseStub.model.calledWithExactly('category', model.schemas.CategorySchema).should.be.true();
            });

        })

    });

});
