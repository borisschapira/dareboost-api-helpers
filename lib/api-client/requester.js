const rp = require('request-promise');
const _ = require('underscore');
const { config } = require('./config');

function requestApi(endpoint, body) {
	return rp({
		method: 'POST',
		uri: config.apiUrl + endpoint,
		body: _.extend(
			{
				token: config.token,
			},
			body
		),
		json: true,
	}).catch((error) => {
		console.log('Error:', error);
	});
}

module.exports = requestApi;
