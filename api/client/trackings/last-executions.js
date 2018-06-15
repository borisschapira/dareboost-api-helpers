const _ = require('underscore');
const {config} = require('../config');
const requestApi = require('../requester');
const getMonitoringList = require('./list');

function getMonitoringLastExecution(monitoringId) {
	return requestApi(config.endpoints.monitoring.lastReport, {monitoringId});
}

function getMonitoringLastExecutions() {
	let activeMonitoringsData = [];
	return getMonitoringList()
		.then(activeMonitorings => {
			activeMonitoringsData = _.where(activeMonitorings.monitorings, {
				enabled: true
			});
			console.log(activeMonitoringsData);
			const activeMonitoringIds = _.pluck(activeMonitoringsData, 'id');
			return Promise.all(_.map(activeMonitoringIds, monitoringId => getMonitoringLastExecution(monitoringId)));
		})
		.then(monitoringLastExecutions => {
			console.log(monitoringLastExecutions);
			return _.map(monitoringLastExecutions, (monitoringLastExecution, index) => {
				console.log(_.omit(monitoringLastExecution.report, 'tips', 'summary', 'timings', 'resourceByType', 'categories') );
				return _.extend(activeMonitoringsData[index], monitoringLastExecution.report.config);
			});
		});
}

module.exports = getMonitoringLastExecutions;
