import config from '../config.mjs';
import { requestApi } from '../requester.mjs';

function getScenarioReports(scenarioId, limit, lastDays, error) {
	return requestApi(config.endpoints.scenario.reports, {
		scenarioId,
		limit,
		lastDays,
		error,
	});
}

export { getScenarioReports };
