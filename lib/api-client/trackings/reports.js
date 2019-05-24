const {config} = require('../config');
const requestApi = require('../requester');

function getMonitoringReports(monitoringId, limit, lastDays, error) {
	return requestApi(config.endpoints.monitoring.reports, {
		monitoringId,
		limit,
		lastDays,
		error
	});
}

module.exports = getMonitoringReports;
