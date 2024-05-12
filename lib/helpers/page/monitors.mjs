import { flattenObjects } from '../../transformations.mjs';
import { doExport } from '../../io.mjs';
import { getMonitoringList } from '../../api-client/trackings/list.mjs';

(async () => {
	const monitoringList = await getMonitoringList();
	doExport(flattenObjects(monitoringList.monitorings), 'trackingConf');
})();
