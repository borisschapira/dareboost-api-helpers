import config from '../config.mjs';
import { requestApi } from '../requester.mjs';

function getMonitoringReports(monitoringId, limit, lastDays, error) {
	return requestApi(config.endpoints.monitoring.reports, {
		monitoringId,
		limit,
		lastDays,
		error,
	});
}

export { getMonitoringReports };
