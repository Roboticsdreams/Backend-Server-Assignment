process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const knex = require('../db/knex');
var should = require('chai').should();

describe('IntegrationTest', () => {
    var app = null;
    before((done) => {
        knex.migrate.latest()
            .then(() => {
                return knex.seed.run()
                    .then(() => {
                        done();
                    });
            })
            .then(() => {
                app = require('../src/server');
            });
    });
    after((done) => {
        knex.migrate.down()
            .then(() => {
                done();
            });
    });
    describe('AppTest', () => {
        it('Invalid Route', (done) => {
            request(app)
                .post('/api')
                .set('Content-Type', 'application/json')
                .expect(404)
                .then((res) => {
                    res.body.should.have.property('message').equal('Not Found');
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('object');
                    expect(res.body.error).to.deep.equal({});
                    done();
                });
        });
    });
    describe('InboundTest', () => {
        it('Inbound SMS Okay', (done) => {
            request(app)
                .post('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 492419550919,
                    "toparam": 4924195509196,
                    "textparam": " test  "
                })
                .expect(200)
                .then((res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('inbound sms ok');
                    res.body.should.have.property('error').equal('');
                    done();
                });
        });
        it('Inbound SMS : GET', (done) => {
            request(app)
                .get('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 492419550919,
                    "toparam": 4924195509196,
                    "textparam": " test  "
                })
                .expect(405)
                .then((res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('');
                    res.body.should.have.property('error').equal('GET not allowed on this route');
                    done();
                });
        });
        it('Inbound SMS - To parameter is not found', (done) => {
            request(app)
                .post('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 492419550919,
                    "toparam": 61871232393,
                    "textparam": " test  "
                })
                .expect(400)
                .then((res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('');
                    res.body.should.have.property('error').equal('to parameter is not found');
                    done();
                });
        });
        it('Inbound SMS - Unknown Failure', (done) => {
            request(app)
                .post('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 492419550919,
                    "toparam": 61871232393,
                })
                .expect(400)
                .then((res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('');
                    res.body.should.have.property('error').equal('unknown failure');
                    done();
                });
        });
        it('Inbound SMS - From is missing', (done) => {
            request(app)
                .post('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": "",
                    "toparam": 4924195509196,
                    "textparam": " test  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('from parameter is missing');
                }).finally(() => {
                    done();
                });
        });
        it('Inbound SMS - From is invalid', (done) => {
            request(app)
                .post('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": "12345SSS",
                    "toparam": 4924195509196,
                    "textparam": " test  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('from parameter is invalid');
                }).finally(() => {
                    done();
                });
        });
        it('Inbound SMS - To is missing', (done) => {
            request(app)
                .post('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 1234567,
                    "toparam": "",
                    "textparam": " test  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('to parameter is missing');
                }).finally(() => {
                    done();
                });
        });
        it('Inbound SMS - To is invalid', (done) => {
            request(app)
                .post('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 1234512,
                    "toparam": "1234456M",
                    "textparam": " test  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('to parameter is invalid');
                }).finally(() => {
                    done();
                });
        });
        it('Inbound SMS - Text is missing', (done) => {
            request(app)
                .post('/api/inbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 1234512,
                    "toparam": 4924195509196,
                    "textparam": "  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('text parameter is missing');
                }).finally(() => {
                    done();
                });
        });
    });

    describe('OutboundTest', () => {
        it('Outbound SMS Okay', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 492419550919,
                    "toparam": 4924195509196,
                    "textparam": " test  "
                })
                .expect(200)
                .then((res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('outbound sms ok');
                    res.body.should.have.property('error').equal('');
                    done();
                });
        });
        it('Outbound SMS : GET', (done) => {
            request(app)
                .get('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 492419550919,
                    "toparam": 4924195509196,
                    "textparam": " test  "
                })
                .expect(405)
                .then((res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('');
                    res.body.should.have.property('error').equal('GET not allowed on this route');
                    done();
                });
        });
        it('Outbound SMS - To parameter is not found', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 492419550919,
                    "toparam": 61871232393,
                    "textparam": " test  "
                })
                .expect(400)
                .then((res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('');
                    res.body.should.have.property('error').equal('to parameter is not found');
                    done();
                });
        });
        it('Outbound SMS - Unknown Failure', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 492419550919,
                    "toparam": 61871232393,
                })
                .expect(400)
                .then((res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('');
                    res.body.should.have.property('error').equal('unknown failure');
                    done();
                });
        });
        it('Outbound SMS - From is missing', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": "",
                    "toparam": 4924195509196,
                    "textparam": " test  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('from parameter is missing');
                }).finally(() => {
                    done();
                });
        });
        it('Outbound SMS - From is invalid', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": "12345SSS",
                    "toparam": 4924195509196,
                    "textparam": " test  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('from parameter is invalid');
                }).finally(() => {
                    done();
                });
        });
        it('Outbound SMS - To is missing', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 1234567,
                    "toparam": "",
                    "textparam": " test  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('to parameter is missing');
                }).finally(() => {
                    done();
                });
        });
        it('Outbound SMS - To is invalid', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 1234512,
                    "toparam": 1234,
                    "textparam": " test  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('to parameter is invalid');
                }).finally(() => {
                    done();
                });
        });
        it('Outbound SMS - Text is missing', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 1234512,
                    "toparam": 4924195509196,
                    "textparam": "  "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('text parameter is missing');
                }).finally(() => {
                    done();
                });
        });
        it('Outbound SMS - Same From and To', (done) => {
            request(app)
                .post('/api/outbound/sms')
                .set('Content-Type', 'application/json')
                .send({
                    "auth_id": "20S0KPNOIM",
                    "username": "azr1",
                    "fromparam": 1234567,
                    "toparam": 1234567,
                    "textparam": " text "
                })
                .expect(400)
                .catch((err) => {
                    expect(err[0]).to.deep.equal('sms from 1234567 to 1234567 blocked by STOP request');
                }).finally(() => {
                    done();
                });
        });
    });
});
