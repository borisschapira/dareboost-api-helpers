const _ = require('underscore');
const transformations = require('../transformations');
const io = require('../io');
const getMonitoringList = require('../api-client/trackings/list');
const getMonitoringLastExecutions = require('../api-client/trackings/last-executions');

(async () => {
	const monitoringList = await getMonitoringList();

	const monitoringLastExecutions = await getMonitoringLastExecutions(monitoringList);
	const monitoringLastExecutionsFlat = _.map(monitoringLastExecutions, item => transformations.flattenTrackingData(item));

	io.doExport(monitoringList, 'monitoringList');
	io.doExport(monitoringLastExecutionsFlat, 'trackingConf');
})();

