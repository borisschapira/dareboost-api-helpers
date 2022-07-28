const _ = require('underscore');
const { flattenObjects } = require('../../transformations');
const io = require('../../io');
const getMonitoringList = require('../../api-client/trackings/list');
const getMonitoringLastExecutions = require('../../api-client/trackings/last-executions');

(async () => {
	const monitoringList = await getMonitoringList();
	io.doExport(flattenObjects(monitoringList.monitorings), 'trackingConf');
})();
