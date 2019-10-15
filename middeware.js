const queries = require('./db/queries');
var mcache = require('memory-cache');

module.exports.initializeCache = function (req, res) {
    queries.getAllUser().then(accounts => {
        if (accounts) {
            for (let account of accounts) {
                //console.log("Putting cache for " + account.username);
                mcache.put(account.username, 1, 86400000);
            }
        }
    });
};

module.exports.updateCache = function (req, res, next) {
    //console.log("Inside updatecache");
    var key = req.body.username;
    var cachedcnt = mcache.get(key);
    //console.log(cachedcnt);
    if (cachedcnt) {
        mcache.put(key, cachedcnt + 1)
        if (cachedcnt > 5) {
            var err = new Error('limit reached for ' + key);
            err.status = 400;
            return next(err);
        }
    }
    return next();
};

module.exports.isAuthorized = function (req, res, next) {
    let { username, auth_id } = req.body;

    if (username && auth_id) {
        queries.getUser(username).then(account => {
            if (account) {
                if (auth_id == account.auth_id) {
                    return next();
                }
                else {
                    var err = new Error('User not found');
                    err.status = 400;
                    return next(err);
                }
            }
        });
    }
    else {
        var err = new Error('Not authorized! Go back!');
        err.status = 403;
        return next(err);
    }
};

module.exports.isValidate = function (req, res, next) {
    try {
        const from = req.body.fromparam;
        const to = req.body.toparam;
        var text = req.body.textparam;
        text = text.trim();
        var fromlength = from.toString().length;
        var tolength = to.toString().length;

        var errors = [];
        if (!from) {
            errors.push('from parameter is missing');
        }
        else if ((fromlength < 5 && fromlength > 17)
            || (!Number.isInteger(from))) {

            errors.push('from parameter is invalid');
        }

        if (!to) {
            errors.push('to parameter is missing');
        }
        else if ((tolength < 5 && tolength > 17)
            || (!Number.isInteger(to))) {

            errors.push('to parameter is invalid');
        }

        if (!text) {
            errors.push('text parameter is missing');
        }

        if ((from == to)
            || (from === to)) {

            errors.push("sms from " + from + " to " + to + " blocked by STOP request");
            console.log(errors);
        }

        if (errors.length == 0) {
            return next();
        }
        else {
            errors.status = 400;
            return next(errors);
        }
    }
    catch (err) {
        res.status(400);
        res.json({
            'message': '',
            'error': 'unknown failure'
        });
    }
};
