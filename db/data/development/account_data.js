const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = [
    {
        auth_id: bcrypt.hashSync('20S0KPNOIM', saltRounds),
        username: 'azr1',
    },
    {
        auth_id: bcrypt.hashSync('54P2EOKQ47', saltRounds),
        username: 'azr2',
    },
    {
        auth_id: bcrypt.hashSync('9LLV6I4ZWI', saltRounds),
        username: 'azr3',
    },
    {
        auth_id: bcrypt.hashSync('YHWE3HDLPQ', saltRounds),
        username: 'azr4',
    },
    {
        auth_id: bcrypt.hashSync('6DLH8A25XZ', saltRounds),
        username: 'azr5',
    },
];