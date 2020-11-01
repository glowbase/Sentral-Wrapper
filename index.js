const express = require('express');
const cors = require('cors');

const { getAuthToken, getPage } = require('./utils/sentral');
const { getDailyNotices } = require('./utils/scrape');

const api = express();

api.use(cors());
api.use('/api/', express.static(__dirname));

//? ------------------------------------------
//? API ENDPOINT
//? ------------------------------------------

// Get Auth Token
api.get('auth/token', async (req, res) => {
	try {
		const username = req.query.username;
		const password = req.query.password;

		if (username && password) {
			const token = await getAuthToken(username, password);

			res.status(200).send(token);
		} else {
			res.status(400).send('Please supply a username and password!');
		}
	} catch (error) {
		console.error(error);
		res.status(400).send(error);
	}
});

// Get Page
api.get('page', async (req, res) => {
	try {
		const token = req.query.token;
		const page = req.query.page; 

		if (token) {
			if (page) {
				res.status(200).send(await getPage(token, page));
			} else {
				res.status(400).send('Please supply a page id!');
			}
		} else {
			res.status(400).send('Please supply an authentication token!');
		}
	} catch (error) {
		console.error(error);
		res.status(400).send(error);
	}
});

// Get Dashboard Page
api.get('dashboard/dailynotices', async (req, res) => {
	try {
		const token = req.query.token;

		if (token) {
			res.status(200).send(await getPage(token, 'dashboard/daily_notices'));
		} else {
			res.status(400).send('Please supply a valid authentication token!');
		}
	} catch (error) {
		console.error(error);
		res.status(400).send(error);
	}
});

// API Endpoint
api.listen(3000, () => {
	console.log('HTTP Endpoint Listening on port 3000');
});