const _ = require("underscore");
const { flattenObjects } = require("../../transformations");
const io = require("../../io");
const getMonitoringList = require("../../api-client/trackings/list");
const getMonitoringLastExecutions = require("../../api-client/trackings/last-executions");

(async () => {
	const monitoringList = await getMonitoringList();

	// Add a direct link to edition
	_.map(
		monitoringList.monitorings,
		item =>
			(item.editUrl =
				"https://www.dareboost.com/" +
				(item.lang ? item.lang : "en") +
				"/tracking/edit/" +
				item.id)
	);

	io.doExport(flattenObjects(monitoringList.monitorings), "trackingConf");
})();
