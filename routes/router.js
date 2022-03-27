const router = require('express').Router();
const database = include('databaseConnection');
//const dbModel = include('databaseAccessLayer');
//const dbModel = include('staticData');
 const userCollection = database.db('lab_example').collection('users')
// const userModel = include('models/web_user');
// const petModel = include('models/pet');
var ObjectId = require('mongodb').ObjectId;
const Joi = require("joi");

const crypto = require('crypto');
const { v4: uuid } = require('uuid');

const passwordPepper = "SeCretPeppa4MySal+";

router.get('/', async (req, res) => {
	console.log("page hit");
	try {
		//const users = await userModel.findAll({attributes: ['web_user_id','first_name','last_name','email']}); //{where: {web_user_id: 1}}
		const userCollection = database.db("lab_example").collection("users");
		const users = await userCollection.find().project({ first_name: 1, last_name: 1, email: 1, _id: 1 }).toArray();
		if (users === null) {
			res.render('error', { message: 'Error connecting to MongoDB' });
			console.log("Error connecting to userModel");
		}
		else {
			console.log(users);
			res.render('index', { allUsers: users });
		}
	}
	catch (ex) {
		res.render('error', { message: 'Error connecting to MongDB' });
		console.log("Error connecting to MongoDB");
		console.log(ex);
	}
});

router.get('/pets', async (req, res) => {
	console.log("page hit");
	try {
		//	const users = await userCollection.find().project({ first_name: 1, last_name: 1, email: 1, _id: 1 }).toArray();
		const petCollection = database.db('lab_example').collection("pets");
		const pets = await petCollection.find().project({pet_name: 1, users_id:1, id: 1}).toArray();
		console.log(pets)
		if (pets === null) {
			res.render('error', { message: 'Error connecting to MongoDB' });
			console.log("Error connecting to MongoDB");
		}
		else {
			console.log(pets);
			res.render('pets', { allPets: pets });
		}
	}
	catch (ex) {
		res.render('error', { message: 'Error connecting to MongoDB' });
		console.log("Error connecting to MongoDB");
		console.log(ex);
	}
});



router.get('/showPets', async (req, res) => {
	console.log("page hit");
	try {
		let userId = req.query.id;
		const user = await userCollection.find(userId);
		const petCollection = database.db('lab_example').collection("pets");
		const pets = await petCollection.find().project({pet_name: 1, users_id: 1, _id: 1}).toArray();
		if (user === null) {
			res.render('error', { message: 'Error connecting to MongoDB' });
			console.log("Error connecting to MongoDB");
		}
		else {
			// let pets = await user.getPets();
			// console.log(pets);
			// let owner = await pets[0].getOwner();
			// console.log(owner);``

			res.render('pets', { allPets: pets });
		}
	}
	catch (ex) {
		res.render('error', { message: 'Error connecting to MySQL' });
		console.log("Error connecting to MySQL");
		console.log(ex);
	}
});

router.get('/deleteUser', async (req, res) => {
	try {
		console.log("delete user");

		let userId = req.query.id;
		if (userId) {
			console.log("userId: " + userId);
			const deleteUser = await userCollection.deleteOne( {"_id": ObjectId(userId)})
			console.log("deleteUser: ");
			console.log(deleteUser);
		}

		res.redirect("/");
	}
	catch (ex) {
		res.render('error', { message: 'Error connecting to MongoDB' });
		console.log("Error connecting to MongoDB");
		console.log(ex);
	}
});

router.post('/addUser', async (req, res) => {
    try {
        console.log("form submit");
        const schema = Joi.object().keys({
            first_name: Joi.string().max(15).required(),
            last_name: Joi.string().max(15).required(),
            email: Joi.string().email().required(),
           // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
		   password: Joi.string().max(20).required()
        });
        const validationResult = schema.validate(req.body);
        if (validationResult.error != null) {
            console.log(validationResult.error);
            throw validationResult.error;
        }

        const password_salt = crypto.createHash('sha512');

        password_salt.update(uuid());

        const password_hash = crypto.createHash('sha512');

        password_hash.update(req.body.password + passwordPepper + password_salt);

        let newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password_salt: password_salt.digest('hex'),
            password_hash: password_hash.digest('hex')
        };
        const userCollection = database.db('lab_example').collection('users');
        //await userCollection.insertOne({ first_name: newUser.first_name, last_name: newUser.last_name, email: newUser.email, password_salt: newUser.password_salt, password_hash: newUser.password_hash });
		await userCollection.insertOne(newUser);
        res.redirect("/");
    }
    catch (ex) {
        res.render('error', { message: 'Error connecting to MySQL' });
        console.log("Error connecting to MySQL");
        console.log(ex);
    }
});

// router.post('/addUser', async (req, res) => {
// 	const schema = Joi.object().keys({ 
// 		first_name: Joi.string().max(30) .required(),
// 		last_name: Joi.string().max(30) .required(),
// 		email: Joi.string().email().required(),
// 		password: Joi.string().max(30).required()
// 	});
// 	//const schema = Joi.string().max(10).required();
// 	const validationResult = schema.validate(req.body);
// 	if (validationResult.error != null) {
// 		console.log(validationResult.error);
// 		throw validationResult.error;
// 	}

// 	try {
// 		console.log("form submit");

// 		const password_salt = crypto.createHash('sha512');

// 		password_salt.update(uuid());

// 		const password_hash = crypto.createHash('sha512');

// 		password_hash.update(req.body.password + passwordPepper + password_salt);

// 		let newUser = 
// 			{
// 				first_name: req.body.first_name,
// 				last_name: req.body.last_name,
// 				email: req.body.email,
// 				password_salt: password_salt.digest('hex'),
// 				password_hash: password_hash.digest('hex')
// 			}
// 		// await newUser.save();
// 		const userCollection = database.db('lab_example').collection('users')
// 		await userCollection.insertOne({first_name: newUser.first_name, last_name: newUser.last_name, email: newUser.email, password_salt: newUser.password_salt, password_hash: newUser.password_hash});
// 		res.redirect("/");
// 	}
// 	catch (ex) {
// 		res.render('error', { message: 'Error connecting to MongDB' });
// 		console.log("Error connecting to MongoDB");
// 		console.log(ex);
// 	}
// });

/*
router.get('/', (req, res) => {
	console.log("page hit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MySQL'});
			console.log("Error connecting to mysql");
			console.log(err);
		}
		else {
			
			dbModel.getAllUsers((err, result) => {
				if (err) {
					res.render('error', {message: 'Error reading from MySQL'});
					console.log("Error reading from mysql");
					console.log(err);
				}
				else { //success
					res.render('index', {allUsers: result});

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			dbConnection.release();
		}
	});
});
*/

/*
router.post('/addUser', (req, res) => {
	console.log("form submit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MySQL'});
			console.log("Error connecting to mysql");
			console.log(err);
		}
		else {
			console.log(req.body);
			dbModel.addUser(req.body, (err, result) => {
				if (err) {
					res.render('error', {message: 'Error writing to MySQL'});
					console.log("Error writing to mysql");
					console.log(err);
				}
				else { //success
					res.redirect("/");

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			
			dbConnection.release();
		}
	});

});
*/

/*
router.get('/deleteUser', (req, res) => {
	console.log("delete user");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MySQL'});
			console.log("Error connecting to mysql");
			console.log(err);
		}
		else {
			console.log(req.query);

			let userId = req.query.id;
			if (userId) {
				dbModel.deleteUser(userId, (err, result) => {
					if (err) {
						res.render('error', {message: 'Error writing to MySQL'});
						console.log("Error writing to mysql");
						console.log(err);
					}
					else { //success
						res.redirect("/");

						//Output the results of the query to the Heroku Logs
						console.log(result);
					}
				});
			}
			else {
				res.render('error', {message: 'Error on Delete'});
			}
		
			dbConnection.release();
		}
	});
});
*/

module.exports = router;
