const _ = require('underscore');
const transformations = require('../../transformations');
const io = require('../../io');
const getMonitoringList = require('../../api-client/trackings/list');
const getMonitoringReports = require('../../api-client/trackings/reports');

(async () => {
	const avgValuesData = [];

	const monitoringList = await getMonitoringList();

	const enabledMonitorings = monitoringList.monitorings.filter(
		(x) => x.enabled
	);

	for (const i in enabledMonitorings) {
		const monitor = monitoringList.monitorings[i];

		console.log(monitor.name);

		monitoringReports = await getMonitoringReports(
			monitor.id,
			30240,
			90,
			false
		);

		if (!monitoringReports || monitoringReports.status != 200) {
			console.log('\t Ko.');
			continue;
		}

		avgValuesData.push(
			_.extend(
				{
					url: monitor.url,
					name: monitor.name,
					score: monitoringReports.statistics.averageScore,
					requests: monitoringReports.statistics.averageRequests,
					loadTime: monitoringReports.statistics.averageLoadTime,
				},
				monitoringReports.statistics.averageTimings
			)
		);
	}

	io.doExport(avgValuesData, 'avgMonitoringValues');
})();
