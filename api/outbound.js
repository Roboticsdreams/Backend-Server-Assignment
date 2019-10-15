const express = require('express');
const router = express.Router();
const queries = require('../db/queries');
const auth = require('../middeware');

router.post('/', auth.isValidate, (req, res) => {
    queries.getPhonelist(req.body.username, req.body.toparam)
        .then(account => {
            if (account.length == 0) {
                res.status(400);
                res.json({
                    'message': '',
                    'error': 'to parameter is not found'
                });
            }
            else {
                res.status(200);
                res.json({
                    'message': 'outbound sms ok',
                    'error': ''
                });
            }
        });
});


router.all('/', (req, res) => {
    res.status(405);
    res.json({
        'message': '',
        'error': req.method + ' not allowed on this route'
    });
});

module.exports = router;