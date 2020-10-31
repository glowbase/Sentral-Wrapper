const express = require('express');
const cors = require('cors');

const { getAuthToken, getPage } = require('./utils/sentral');
const { getDailyNotices } = require('./utils/scrape');

const app = express();

app.use(cors());
app.use('/', express.static(__dirname));

//? ------------------------------------------
//? API ENDPOINT
//? ------------------------------------------

// Get Auth Token
app.get('/api/auth/token', async (req, res) => {
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
app.get('/api/page', async (req, res) => {
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
app.get('/api/dashboard/dailynotices', async (req, res) => {
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


//? ------------------------------------------
//? WEB APPLICATION
//? ------------------------------------------

// Login 
app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/assets/pages/login.html');
});

// Dashboard
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/assets/pages/dashboard.html');
});

// Start Web Server
app.listen(3000, () => {
	console.log('Web Server Listening on port 3000');
});