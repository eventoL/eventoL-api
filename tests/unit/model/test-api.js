'use strict';

const should = require('should');
const sinon = require('sinon');
const proxyquire =  require('proxyquire').noCallThru();
const baucisStub = require('../mocks/baucis-mock');
const dotenvStub = require('../mocks/dotenv-mock');
const Q = require('q');

describe('Api', () => {
    let api;
    let model;

    beforeEach(() => {
        model = {
            find: sinon.stub().returns({
                exec: sinon.stub().returns(Q([{name: 'pepe'}])),
                skip: sinon.stub().returns({
                    limit: sinon.stub().returns({
                        populate: sinon.stub().returns({
                            populate: sinon.stub().returns({
                                exec: sinon.stub().returns(Q([{name: 'pepe'}]))
                            })
                        })
                    })
                })
            }),
            modelName: 'name',
            schema: {
                post: sinon.spy(),
                tree: {
                    title: {
                        populate: true
                    },
                    name: {
                        populate: false
                    },
                    description: {}
                }
            }
        };
        api = proxyquire('../../../lib/model/api', {
            'baucis': baucisStub,
            'dotenv': dotenvStub,
            './model': {models: {Event: model}}
        });
    });

    describe('register', () => {

        it('should called baucis.rest with the model', () => {
            api.register(model);
            baucisStub.rest.calledWithExactly(model.modelName).should.be.true();
        });

    });

    describe('load', () => {

        it('should called baucis.rest with load models', () => {
            api.load();
            baucisStub.rest.calledWithExactly(model.modelName).should.be.true();
        });

    });

    describe('execQuery', () => {

        it('should use default page', () => {
            return api.execQuery(model, {name: 'pepe'})
                .then((result) => result.page.should.be.equal(1));
        });

        it('should use default limit', () => {
            return api.execQuery(model, {name: 'pepe'})
                .then((result) => result.limit.should.be.equal(10));
        });

        it('should change page', () => {
            let page = 2;
            return api.execQuery(model, {name: 'pepe'}, page)
                .then((result) => result.page.should.be.equal(2));
        });

        it('should change limit', () => {
            let page = 2;
            let limit = 5;
            return api.execQuery(model, {name: 'pepe'}, page, limit)
                .then((result) => result.limit.should.be.equal(5));
        });

        it('should return result with exec', () => {
            return api.execQuery(model, {name: 'pepe'})
                .then((result) => result.results.should.be.deepEqual([{name: 'pepe'}]));
        });

        it('should called exec', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find().skip().limit().populate().populate().exec.called.should.be.true();
        });

        it('should called populate', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find().skip().limit().populate.called.should.be.true();
        });

        it('should called populate with correct params when populate is true', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find().skip().limit().populate.calledWithExactly('title').should.be.true();
        });

        it('should called populate with correct params when populate is false', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find().skip().limit().populate().populate.calledWithExactly('name', 'url').should.be.true();
        });

        it('should called limit', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find().skip().limit.called.should.be.true();
        });

        it('should called limit with correct params', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find().skip().limit.calledWithExactly(10).should.be.true();
        });

        it('should called limit with correct params when limit is changed', () => {
            api.execQuery(model, {name: 'pepe'}, 5, 15);
            model.find().skip().limit.calledWithExactly(15).should.be.true();
        });

        it('should called skip', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find().skip.called.should.be.true();
        });

        it('should called skip with correct params', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find().skip.calledWithExactly(10 * (1 - 1)).should.be.true();
        });

        it('should called skip with correct params when limit is changed', () => {
            api.execQuery(model, {name: 'pepe'}, 5, 15);
            model.find().skip.calledWithExactly(15 * (5 - 1)).should.be.true();
        });

        it('should called find', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find.called.should.be.true();
        });

        it('should called find with correct params', () => {
            api.execQuery(model, {name: 'pepe'});
            model.find.calledWithExactly({name: 'pepe'}).should.be.true();
        });

    });

    describe('getEventForRelationship', () => {

        it('should called find with correct params', () => {
            api.getEventForRelationship(model, 'name', {name: 'pepe'});
            model.find.calledWithExactly({name: 'pepe'}).should.be.true();
        });

        it('should called find', () => {
            api.getEventForRelationship(model, 'name', {name: 'pepe'});
            model.find.called.should.be.true();
        });

        it('should called exec', () => {
            api.getEventForRelationship(model, 'name', {name: 'pepe'});
            model.find().exec.called.should.be.true();
        });

        it('should use default page', () => {
            return api.getEventForRelationship(model, 'name', {name: 'pepe'})
                .then((result) => result.page.should.be.equal(1));
        });

        it('should use default limit', () => {
            return api.getEventForRelationship(model, 'name', {name: 'pepe'})
                .then((result) => result.limit.should.be.equal(10));
        });

        it('should change page', () => {
            let page = 2;
            return api.getEventForRelationship(model, 'name', {name: 'pepe'}, page)
                .then((result) => result.page.should.be.equal(2));
        });

        it('should change limit', () => {

            let page = 2;
            let limit = 5;
            return api.getEventForRelationship(model, 'name', {name: 'pepe'}, page, limit)
                .then((result) => result.limit.should.be.equal(5));
        });

    });

});
