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
			activeMonitoringsData = activeMonitorings.monitorings;
			const activeMonitoringIds = _.pluck(_.where(activeMonitorings.monitorings, {
				enabled: true
			}), 'id');
			return Promise.all(_.map(activeMonitoringIds, monitoringId => getMonitoringLastExecution(monitoringId)));
		})
		.then(monitoringLastExecutions => {
			return _.map(monitoringLastExecutions, (monitoringLastExecution, index) => {
				return _.extend(activeMonitoringsData[index], monitoringLastExecution.report.config);
			});
		});
}

module.exports = getMonitoringLastExecutions;
