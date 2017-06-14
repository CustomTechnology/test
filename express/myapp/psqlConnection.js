var psql = require('pg-promise');

var config = {
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: 'test_1'
};

var connection = psql.createConnection(config);

module.exports = connection;