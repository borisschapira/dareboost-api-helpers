const fs = require('fs');
const _ = require('underscore');
const getMonitoringLastExecutions = require('./api/client/trackings/last-executions');

const filepath = 'output.json';

getMonitoringLastExecutions()
	.then(data => {
		const normalizedData = _.map(data, item => flattenData(item));
		const jsonContent = JSON.stringify(normalizedData);
		fs.writeFile(filepath, jsonContent, 'utf8', err => {
			if (err) {
				console.log('An error occured while writing JSON Object to File.', err);
			}

			console.log('JSON file ' + filepath + ' has been saved.');
		});
	});

function flattenData(trackingData) {
	if (trackingData.browser && trackingData.browser.name) {
		trackingData.browserName = trackingData.browser.name;
	}
	if (trackingData.bandwidth) {
		if (trackingData.bandwidth.upstream) {
			trackingData.bandwidthUpstream = trackingData.bandwidth.upstream;
		}
		if (trackingData.bandwidth.downstream) {
			trackingData.bandwidthDownstream = trackingData.bandwidth.downstream;
		}
	}
	if (trackingData.screen) {
		if (trackingData.screen.height) {
			trackingData.screenHeight = trackingData.screen.height;
		}
		if (trackingData.screen.width) {
			trackingData.screenWidth = trackingData.screen.width;
		}
	}
	if (trackingData.header && trackingData.header.length > 0) {
		const headerLength = trackingData.header.length;
		for (let i = 0; i < headerLength; i++) {
			trackingData['header_' + trackingData.header[i].key] = trackingData.header[i].value;
		}
	}
	if (trackingData.id && trackingData.lang) {
		trackingData.trackingUrl = 'https://www.dareboost.com/' + trackingData.lang + '/tracking/view/' + trackingData.id;
	}

	const pickedPropItem = _.extend({}, _.pick(trackingData, 'id', 'trackingUrl', 'url', 'name', 'state', 'lastExecution', 'lastExecutionReportUrl', 'lang', 'enabled', 'location', 'browserName', 'isMobile', 'bandwidthUpstream', 'bandwidthDownstream', 'latency', 'isPrivate', 'adblock', 'screenHeight', 'screenWidth'), _.pick(trackingData, (value, key) => {
		return key.startsWith('header_');
	}));

	return pickedPropItem;
}

