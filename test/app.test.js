process.env.NODE_ENV = 'test';

const request = require('supertest');
const expect = require('chai').expect;
const knex = require('../db/knex');
var should = require('chai').should();

describe('App Test', () => {
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
                app = require('../app');
            });
    });

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
    it('Outbound SMS Okay', (done) => {
        request(app)
            .post('/api/outbound/sms')
            .set('Content-Type', 'application/json')
            .send({
                "auth_id": "20S0KPNOIM",
                "username": "azr1",
                "fromparam": 492419550919,
                "toparam": 4924195509196,
                "textparam": " gf  "
            })
            .expect(200)
            .then((res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('message').equal('outbound sms ok');
                res.body.should.have.property('error').equal('');
                done();
            });
    });

});