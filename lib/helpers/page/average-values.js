const _ = require('underscore');
const transformations = require('../../transformations');
const io = require('../../io');
const getMonitoringList = require('../../api-client/trackings/list');
const getMonitoringReports = require('../../api-client/trackings/reports');

(async () => {
	const avgValuesData = [];

	const monitoringList = await getMonitoringList();

	for (const i in monitoringList.monitorings) {
		const monitor = monitoringList.monitorings[i];
		monitoringReports = await getMonitoringReports(
			monitor.id,
			30240,
			90,
			false
		);
		avgValuesData.push({
			url: monitor.url,
			name: monitor.name,
			score: monitoringReports.statistics.averageScore,
			requests: monitoringReports.statistics.averageRequests,
			loadTime: monitoringReports.statistics.averageLoadTime,
			visuallyComplete:
				monitoringReports.statistics.averageTimings.visuallyComplete,
			firstByte: monitoringReports.statistics.averageTimings.firstByte,
			domInteractive:
				monitoringReports.statistics.averageTimings.domInteractive,
			startRender: monitoringReports.statistics.averageTimings.startRender,
			loadEvent: monitoringReports.statistics.averageTimings.loadEvent,
			speedIndex: monitoringReports.statistics.averageTimings.speedIndex,
		});
	}

	io.doExport(avgValuesData, 'avgMonitoringValues');
})();
