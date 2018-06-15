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
				console.log('An error occured while writing JSON Object to File.');
				return console.log(err);
			}

			console.log('JSON file ' + filepath + ' has been saved.');
		});
	});

function flattenData(trackingData) {
	if(trackingData.browser && trackingData.browser.name) {
		trackingData.browserName = trackingData.browser.name;
	}
	if(trackingData.bandwidth) {
		if(trackingData.bandwidth.upstream) {
			trackingData.bandwidthUpstream = trackingData.bandwidth.upstream;
		}
		if(trackingData.bandwidth.downstream) {
			trackingData.bandwidthDownstream = trackingData.bandwidth.downstream;
		}
	}
	if(trackingData.screen) {
		if(trackingData.screen.height) {
			trackingData.screenHeight = trackingData.screen.height;
		}
		if(trackingData.screen.width) {
			trackingData.screenWidth = trackingData.screen.width;
		}
	}
	if(trackingData.headers && trackingData.headers.length > 0){
		const headerLength = trackingData.headers.length;
		for(let i; i < headerLength; i++) {
			trackingData['header_' . trackingData.headers[i].key] = trackingData.headers[i].value;
		}
	}

	const pickedPropItem = _.pick(trackingData, 'id', 'url', 'name', 'state', 'lastExecution', 'enabled', 'location', 'browserName', 'isMobile', 'bandwidthUpstream', 'bandwidthDownstream', 'latency', 'isPrivate', 'adblock', 'screenHeight', 'screenWidth');

	return pickedPropItem;
}


