const _ = require('underscore');
const { config } = require('../config');
const requestApi = require('../requester');
const getMonitoringList = require('./list');

function getMonitoringLastExecution(monitoringId) {
	return requestApi(config.endpoints.monitoring.lastReport, {
		monitoringId,
		getUniqueIDsForTips: true,
	});
}

async function getMonitoringLastExecutions(monitoringList, predicateTips) {
	const activeMonitorings = monitoringList || (await getMonitoringList());
	// Const activeMonitoringsData = _.where(activeMonitorings.monitorings, {
	// 	enabled: true
	// });

	const activeMonitoringsData = activeMonitorings.monitorings;

	const activeMonitoringIds = _.pluck(activeMonitoringsData, 'id');

	const monitoringLastExecutions = [];
	for (let index = 0; index < activeMonitoringIds.length; index++) {
		console.log("Get last report from monitor", activeMonitoringIds[index]);
		monitoringLastExecutions.push(await getMonitoringLastExecution(activeMonitoringIds[index]));
	}

	return _.map(monitoringLastExecutions, (monitoringLastExecution, index) => {
		let withLastReportData = _.extend(activeMonitoringsData[index]);

		if (monitoringLastExecution && monitoringLastExecution.report) {
			if (!monitoringLastExecution.report.summary) {
				console.log(monitoringLastExecution);
			}

			withLastReportData = _.extend(
				withLastReportData,
				{
					lang: monitoringLastExecution.report.lang,
					lastExecutionReportUrl:
						monitoringLastExecution.report.publicReportUrl,
					score: monitoringLastExecution.report.summary
						? monitoringLastExecution.report.summary.score
						: -1,
				},
				monitoringLastExecution.report.config
			);

			if (predicateTips) {
				const tips = _.filter(
					monitoringLastExecution.report.tips,
					predicateTips
				);
				withLastReportData = _.extend(withLastReportData, { tips });
			}
		}

		return withLastReportData;
	});
}

module.exports = getMonitoringLastExecutions;
