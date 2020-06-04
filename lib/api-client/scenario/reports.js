const { config } = require('../config');
const requestApi = require('../requester');

function getScenarioReports(scenarioId, limit, lastDays, error) {
	return requestApi(config.endpoints.scenario.reports, {
		scenarioId,
		limit,
		lastDays,
		error,
	});
}

module.exports = getScenarioReports;
