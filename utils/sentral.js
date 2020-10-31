const request = require('request');
const util = require('util');

const requestPromise = util.promisify(request);
const sentralPages = ['login', 'dashboard', 'timetable', 'resources', 'activities', 'attendance', 'reporting', 'records', 'daily_notices'];

async function getAuthToken(username, password) {
	const options = {
		'method': 'POST',
		'url': 'https://sentral.stgregs.nsw.edu.au/portal/login/login',
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		formData: {
		  'password': password,
		  'username': username,
		},
	};
	
	const token = await (await requestPromise(options)).headers['set-cookie'][0].split(';')[0].split('=')[1];
	const dashboardPage = await getDashboardPage(token);

	if (dashboardPage.includes('<title>My Dashboard</title>')) {
		return token;
	} else {
		return 'Invalid Username or Password!';
	}
}

async function getPage(token, page) {
	if (sentralPages.includes(page) || page == 'daily_notices') {
		if (page == 'daily_notices') page = 'dashboard/' + page;

		const options = {
			'method': 'GET',
			'url': `https://sentral.stgregs.nsw.edu.au/portal/${page}`,
			'headers': {
				'Cookie': `PortalSID=${token}; PortalLoggedIn=1`,
			}
		};

		return await (await requestPromise(options)).body;
	} else {
		return `Error: An invalid page id was provided!`;
	}
}

module.exports = {
	getAuthToken,
	getPage,
};