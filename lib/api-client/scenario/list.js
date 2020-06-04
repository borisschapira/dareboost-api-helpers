const { config } = require('../config');
const requestApi = require('../requester');

function getScenarioList() {
	return requestApi(config.endpoints.scenario.list);
}

module.exports = getScenarioList;
