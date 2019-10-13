process.env.NODE_ENV = 'test';

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const auth = require("../middeware");
const queries = require("../db/queries");
var should = require('chai').should();

const accounts = [
    { id: 1, auth_id: '20S0KPNOIM', username: 'azr1' },
    { id: 2, auth_id: '54P2EOKQ47', username: 'azr2' },
    { id: 3, auth_id: '9LLV6I4ZWI', username: 'azr3' },
    { id: 4, auth_id: 'YHWE3HDLPQ', username: 'azr4' },
    { id: 5, auth_id: '6DLH8A25XZ', username: 'azr5' }];

describe("MiddlewareTest", function () {
    it("isAuthorized - Positive", function () {
        sinon.stub(queries, 'getUser').callsFake(function () {
            return accounts[0];
        });
        let req = {
            body: {
                username: accounts[0].username,
                auth_id: accounts[0].auth_id,
            }
        };
        should(auth.isAuthorized(req)).be.true;
        queries.getUser.restore(); // restore original functionality
    });
});
