const host = 'www.dareboost.com';
const apiVersion = '0.5.1';
const token = process.env.DB_API_TOKEN;

exports.config = {
	apiUrl: 'https://' + host + '/api/' + apiVersion,
	endpoints: {
		monitoring: {
			list: '/monitoring/list',
			lastReport: '/monitoring/last-report'
		}
	},
	token
};
