const transformations = require('../../transformations');
const io = require('../../io');
const getMonitoringList = require('../../api-client/trackings/list');
const getMonitoringLastExecutions = require('../../api-client/trackings/last-executions');

// Predicate used to filter tips in tracking data
function predicateTip(tip) {
	return tip.score < 100 && tip.priority > 0;
}

(async () => {
	const monitoringList = await getMonitoringList();

	const monitoringLastExecutions = await getMonitoringLastExecutions(
		monitoringList,
		predicateTip
	);

	io.doExport(
		transformations.flattenEachTrackingData(monitoringLastExecutions),
		'trackingConf'
	);
	io.doExport(
		transformations.groupTipsFromTrackingData(monitoringLastExecutions),
		'commonTips'
	);
})();
