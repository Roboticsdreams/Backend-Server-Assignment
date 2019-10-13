const accounts = require('../../data/production/account_data');
const phonenumbers = require('../../data/production/phonenumber_data');

exports.seed = function (knex) {
  return knex('phone_number').del()
    .then(function () {
      return knex('account').del()
        .then(function () {
          return knex('account').insert(accounts);
        })
        .then(function () {
          return knex('phone_number').insert(phonenumbers);
        });
    });
};
