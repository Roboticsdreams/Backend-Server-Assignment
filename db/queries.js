const knex = require('./knex');

module.exports = {
    getUser(username) {
        return knex('account').where('username', username).first();
    },
    getAllUser() {
        return knex('account');
    },
    getPhonelist(username, pnumber) {
        return knex
            .select(
                'p.number',
                'p.accountid'
            )
            .from('account AS a')
            .leftJoin('phone_number AS p', 'p.accountid', 'a.id')
            .where('a.username', '=', username)
            .where('p.number', '=', pnumber);
    }
};