const _ = require('underscore');
const forEachTimeout = require('foreach-timeout');
const {
	config
} = require('../config');
const requestApi = require('../requester');
const getMonitoringList = require('./list');

function getMonitoringLastExecution(monitoringId) {
	return requestApi(config.endpoints.monitoring.lastReport, {
		monitoringId,
		"getUniqueIDsForTips": true
	});
}

async function getMonitoringLastExecutions(monitoringList, predicateTips) {
	const activeMonitorings = monitoringList || await getMonitoringList();
	const activeMonitoringsData = _.where(activeMonitorings.monitorings, {
		enabled: true
	});
	const activeMonitoringIds = _.pluck(activeMonitoringsData, 'id');

	const monitoringLastExecutions = await forEachTimeout(_.map(activeMonitoringIds, id => getMonitoringLastExecution(id)), e => Promise.resolve(e), config.delay);

	return _.map(monitoringLastExecutions, (monitoringLastExecution, index) => {
		if(!monitoringLastExecution.report.summary) {
			console.log(monitoringLastExecution);
		}
		let withLastReportData = _.extend(activeMonitoringsData[index], {
			lang: monitoringLastExecution.report.lang,
			lastExecutionReportUrl: monitoringLastExecution.report.publicReportUrl,
			score: monitoringLastExecution.report.summary ? monitoringLastExecution.report.summary.score : -1
		}, monitoringLastExecution.report.config);

		if (predicateTips) {
			const tips = _.filter(monitoringLastExecution.report.tips, predicateTips);
			withLastReportData = _.extend(withLastReportData, {tips});
		}

		return withLastReportData;
	});
}

module.exports = getMonitoringLastExecutions;
