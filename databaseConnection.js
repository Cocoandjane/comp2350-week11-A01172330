const mysql = require('mysql2');

const is_heroku = process.env.IS_HEROKU || false;

//mongodb+srv://janeral:BCIT@2022coding@cluster0.gi0kw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const dbConfigHeroku = {
	host: "us-cdbr-east-03.cleardb.com",
	user: "janeral",
	password: "BCIT@2022coding",
	database: "heroku_3d208ad4bd6f421",
	multipleStatements: false,
	namedPlaceholders: true
};

const dbConfigLocal = {
	host: "localhost",
	user: "root",
	password: "Password",
	database: "lab_example",
	multipleStatements: false,
	namedPlaceholders: true
};

if (is_heroku) {
	var database = mysql.createPool(dbConfigHeroku);
}
else {
	var database = mysql.createPool(dbConfigLocal);
}

module.exports = database;
		