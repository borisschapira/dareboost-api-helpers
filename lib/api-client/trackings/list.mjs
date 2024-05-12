import config from '../config.mjs';
import { requestApi } from '../requester.mjs';

function getMonitoringList() {
	return requestApi(config.endpoints.monitoring.list);
}

export { getMonitoringList };
