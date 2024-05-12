import config from '../config.mjs';
import { requestApi } from '../requester.mjs';

function getScenarioList() {
	return requestApi(config.endpoints.scenario.list);
}

export { getScenarioList };
