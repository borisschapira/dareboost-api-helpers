import {
	flattenEachTrackingData,
	groupTipsFromTrackingData,
} from '../../transformations.mjs';
import { doExport } from '../../io.mjs';
import { getMonitoringList } from '../../api-client/trackings/list.mjs';
import { getMonitoringLastExecutions } from '../../api-client/trackings/last-executions.mjs';

// Predicate used to filter tips in tracking data
function predicateTip(tip) {
	return tip.score < 100 && tip.priority > 0;
}

(async () => {
	const monitoringList = await getMonitoringList();

	const monitoringLastExecutions = await getMonitoringLastExecutions(
		monitoringList,
		predicateTip,
	);

	doExport(flattenEachTrackingData(monitoringLastExecutions), 'trackingConf');
	doExport(groupTipsFromTrackingData(monitoringLastExecutions), 'commonTips');
})();
