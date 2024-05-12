import { pluck, map, extend, filter } from 'underscore';
import config from '../config.mjs';
import { requestApi } from '../requester.mjs';
import { getMonitoringList } from './list.mjs';

function getMonitoringLastExecution(monitoringId) {
	return requestApi(config.endpoints.monitoring.lastReport, {
		monitoringId,
		getUniqueIDsForTips: true,
	});
}

async function getMonitoringLastExecutions(monitoringList, predicateTips) {
	const activeMonitorings = monitoringList || (await getMonitoringList());

	const activeMonitoringsData = activeMonitorings.monitorings;

	const activeMonitoringIds = pluck(activeMonitoringsData, 'id');

	const monitoringLastExecutions = [];
	for (let index = 0; index < activeMonitoringIds.length; index++) {
		console.log('Get last report from monitor', activeMonitoringIds[index]);
		monitoringLastExecutions.push(
			await getMonitoringLastExecution(activeMonitoringIds[index]),
		);
	}

	return map(monitoringLastExecutions, (monitoringLastExecution, index) => {
		let withLastReportData = extend(activeMonitoringsData[index]);

		if (monitoringLastExecution && monitoringLastExecution.report) {
			if (!monitoringLastExecution.report.summary) {
				console.log(monitoringLastExecution);
			}

			withLastReportData = extend(
				withLastReportData,
				{
					lang: monitoringLastExecution.report.lang,
					lastExecutionReportUrl:
						monitoringLastExecution.report.publicReportUrl,
					score: monitoringLastExecution.report.summary
						? monitoringLastExecution.report.summary.score
						: -1,
				},
				monitoringLastExecution.report.config,
			);

			if (predicateTips) {
				const tips = filter(monitoringLastExecution.report.tips, predicateTips);
				withLastReportData = extend(withLastReportData, { tips });
			}
		}

		return withLastReportData;
	});
}

export { getMonitoringLastExecutions };
