const _ = require('underscore');
const {
	config
} = require('../config');
const requestApi = require('../requester');
const getMonitoringList = require('./list');
const forEachTimeout = require('foreach-timeout');

function getMonitoringLastExecution(monitoringId) {
	return requestApi(config.endpoints.monitoring.lastReport, {
		monitoringId
	});
}

async function getMonitoringLastExecutions() {
	const activeMonitorings = await getMonitoringList();
	const activeMonitoringsData = _.where(activeMonitorings.monitorings, {
		enabled: true
	});
	const activeMonitoringIds = _.pluck(activeMonitoringsData, 'id');

	const monitoringLastExecutions = await forEachTimeout(_.map(activeMonitoringIds, id => getMonitoringLastExecution(id)), e => Promise.resolve(e), config.delay);

	return _.map(monitoringLastExecutions, (monitoringLastExecution, index) => {
		return _.extend(activeMonitoringsData[index], {
			lang: monitoringLastExecution.report.lang,
			lastExecutionReportUrl: monitoringLastExecution.publicReportUrl
		}, monitoringLastExecution.report.config);
	});
}

module.exports = getMonitoringLastExecutions;
