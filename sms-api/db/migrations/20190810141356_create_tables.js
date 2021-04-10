
exports.up = function(knex) {
    return knex.schema.createTable('account', (table) => {
        table.increments('id').primary();
        table.text('auth_id');
        table.text('username');
    })
    .then(function () {
        return knex.schema.createTable('phone_number', (table) => {
            table.increments('id');
            table.text('number');
            table.integer('accountid',11).unsigned().references('id').inTable('account');
        });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('phone_number')
        .dropTableIfExists('account')
};
