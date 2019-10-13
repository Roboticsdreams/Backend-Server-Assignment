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
    it("isAuthorized - Positive", async function () {
        sinon.stub(queries, 'getUser').resolves(accounts[0]);
        let req = {
            body: {
                username: accounts[0].username,
                auth_id: accounts[0].auth_id,
            }
        };
        const next = sinon.spy();
        const res = sinon.spy();
        await auth.isAuthorized(req, res, next);
        expect(next.calledOnce).to.be.true;

        queries.getUser.restore(); // restore original functionality
    });
    it("isAuthorized - User not found", async function () {
        sinon.stub(queries, 'getUser').resolves(accounts[0]);
        let req = {
            body: {
                username: accounts[1].username,
                auth_id: accounts[1].auth_id,
            }
        };
        const res = sinon.spy();
        const next = sinon.spy();
        await auth.isAuthorized(req, res, next);
        const error = next.getCall(0);
        expect(error).to.be.match(/User not found/);
        queries.getUser.restore(); // restore original functionality
    });
    it("isAuthorized - User not Authorized", async function () {
        sinon.stub(queries, 'getUser').resolves(accounts[0]);
        let req = {
            body: {
                username: accounts[1].username,
            }
        };
        const res = sinon.spy();
        const next = sinon.spy();
        await auth.isAuthorized(req, res, next);
        const error = next.getCall(0);
        expect(error).to.be.match(/Not authorized! Go back!/);
        queries.getUser.restore(); // restore original functionality
    });
});
