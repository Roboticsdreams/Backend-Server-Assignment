process.env.NODE_ENV = 'test';

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const auth = require("../middeware");
const queries = require("../db/queries");
var mcache = require('memory-cache');

const accounts = [
    { id: 1, auth_id: '20S0KPNOIM', username: 'azr1' },
    { id: 2, auth_id: '54P2EOKQ47', username: 'azr2' }];

const tempaccounts = [
    { id: 101, auth_id: '54P2KPNOIM', username: 'testuser' },
];
describe("UnitTest", function () {

    describe("isAuthorized", function () {
        it("Return True", async function () {
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
        it("User not found case1", async function () {
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
        it("User not found case2", async function () {
            sinon.stub(queries, 'getUser').resolves();
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
        it("User not Authorized", async function () {
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
    describe("isValidate", function () {
        it("Return True", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: 492419550919,
                    toparam: 4924195509196,
                    textparam: " test  "
                }
            };
            const next = sinon.spy();
            const res = sinon.spy();
            await auth.isValidate(req, res, next);
            expect(next.calledOnce).to.be.true;
        });
        it("from parameter is missing", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: "",
                    toparam: 4924195509196,
                    textparam: " test  "
                }
            };
            const res = sinon.spy();
            const next = sinon.spy();
            await auth.isValidate(req, res, next);
            const errorarg = next.getCall(0).args[0];
            expect(errorarg.error[0]).to.be.match(/from parameter is missing/);
        });
        it("from parameter is invalid - Length case", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: 1234,
                    toparam: 4924195509196,
                    textparam: " test  "
                }
            };
            const res = sinon.spy();
            const next = sinon.spy();
            await auth.isValidate(req, res, next);
            const errorarg = next.getCall(0).args[0];
            expect(errorarg.error[0]).to.be.match(/from parameter is invalid/);
        });
        it("from parameter is invalid - DataType case", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: "12345SS",
                    toparam: 4924195509196,
                    textparam: " test  "
                }
            };
            const res = sinon.spy();
            const next = sinon.spy();
            await auth.isValidate(req, res, next);
            const errorarg = next.getCall(0).args[0];
            expect(errorarg.error[0]).to.be.match(/from parameter is invalid/);
        });
        it("To parameter is missing", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: 4924195509196,
                    toparam: "",
                    textparam: " test  "
                }
            };
            const res = sinon.spy();
            const next = sinon.spy();
            await auth.isValidate(req, res, next);
            const errorarg = next.getCall(0).args[0];
            expect(errorarg.error[0]).to.be.match(/to parameter is missing/);
        });
        it("To parameter is invalid - Length case", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: 4924195509196,
                    toparam: 4924,
                    textparam: " test  "
                }
            };
            const res = sinon.spy();
            const next = sinon.spy();
            await auth.isValidate(req, res, next);
            const errorarg = next.getCall(0).args[0];
            expect(errorarg.error[0]).to.be.match(/to parameter is invalid/);
        });
        it("To parameter is invalid - DataType case", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: 4924195509196,
                    toparam: "492419S",
                    textparam: " test  "
                }
            };
            const res = sinon.spy();
            const next = sinon.spy();
            await auth.isValidate(req, res, next);
            const errorarg = next.getCall(0).args[0];
            expect(errorarg.error[0]).to.be.match(/to parameter is invalid/);
        });
        it("Text parameter is missing", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: 492419550919,
                    toparam: 4924195509196,
                    textparam: "   "
                }
            };
            const res = sinon.spy();
            const next = sinon.spy();
            await auth.isValidate(req, res, next);
            const errorarg = next.getCall(0).args[0];
            expect(errorarg.error[0]).to.be.match(/text parameter is missing/);
        });
        it("from and to parameter are same", async function () {
            let req = {
                body: {
                    username: accounts[0].username,
                    auth_id: accounts[0].auth_id,
                    fromparam: 4924195509196,
                    toparam: 4924195509196,
                    textparam: " test  "
                }
            };
            const res = sinon.spy();
            const next = sinon.spy();
            await auth.isValidate(req, res, next);
            const errorarg = next.getCall(0).args[0];
            expect(errorarg.error[0]).to.be.match(/sms from 4924195509196 to 4924195509196 blocked by STOP request/);
        });
    });
    /*
    describe("updateCache", function () {
        it("Return True", async function () {
            sinon.stub(queries, 'getAllUser').resolves(tempaccounts);
            await auth.initializeCache();
            let req = {
                body: {
                    username: tempaccounts[0].username,
                }
            };
            const next = sinon.spy();
            const res = sinon.spy();
            await auth.updateCache(req, res, next);
            expect(next.calledOnce).to.be.true;
            queries.getAllUser.restore(); // restore original functionality
        });
        it("Return user limit reached", async function () {
            let req = {
                body: {
                    username: tempaccounts[0].username,
                }
            };
            const next = sinon.spy();
            const res = sinon.spy();
            await auth.updateCache(req, res, next);
            const error = next.getCall(0);
            expect(error).to.be.match(/limit reached for testuser/);
        });
    });*/
});
