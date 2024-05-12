import { extend } from 'underscore';
import config from './config.mjs';
import axios from 'axios';

async function requestApi(endpoint, body) {
	// axios.interceptors.request.use(request => {
	// 	console.log('Starting Request', JSON.stringify(request, null, 2))
	// 	return request
	// })

	// axios.interceptors.response.use(response => {
	// 	console.log('Response:', JSON.stringify(response, null, 2))
	// 	return response
	// })

	return axios
		.post(
			config.apiUrl + endpoint,
			extend(
				{
					token: config.token,
				},
				body,
			),
			{
				headers: {
					// Overwrite Axios's automatically set Content-Type
					'Content-Type': 'application/json',
				},
			},
		)
		.catch(function (error) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error', error.message);
			}
			console.log(error.config);
		})
		.then((response) => {
			return response.data;
		});
}

export { requestApi };
