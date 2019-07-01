const { config } = require("../config");
const requestApi = require("../requester");

function getMonitoringList() {
	return requestApi(config.endpoints.monitoring.list);
}

module.exports = getMonitoringList;
