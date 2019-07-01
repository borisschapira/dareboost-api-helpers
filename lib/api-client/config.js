const host = "www.dareboost.com";
const apiVersion = "0.5.1";
const token = process.env.DB_API_TOKEN;

// Delay between two API calls on iterative calls
const delay = 500;

exports.config = {
	apiUrl: "https://" + host + "/api/" + apiVersion,
	endpoints: {
		monitoring: {
			list: "/monitoring/list",
			lastReport: "/monitoring/last-report",
			reports: "/monitoring/reports"
		},
		scenario: {
			list: "/scenario/list",
			reports: "/scenario/reports"
		}
	},
	delay,
	token
};
