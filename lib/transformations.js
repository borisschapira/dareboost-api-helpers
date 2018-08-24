const _ = require('underscore');

function flattenTrackingData(trackingData) {
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
	if (trackingData.lastExecution) {
		trackingData.lastExecution = new Date(trackingData.lastExecution).toISOString();
	}
	if (trackingData.header && trackingData.header.length > 0) {
		const headerLength = trackingData.header.length;
		for (let i = 0; i < headerLength; i++) {
			trackingData['header_' + trackingData.header[i].key] = trackingData.header[i].value;
		}
	}
	if (trackingData.id) {
		trackingData.trackingUrl = 'https://www.dareboost.com/' + (trackingData.lang ? trackingData.lang : 'en') + '/tracking/edit/' + trackingData.id;
	}

	const pickedPropItem = _.extend({}, _.pick(trackingData, 'id', 'trackingUrl', 'url', 'name', 'state', 'lastExecution', 'lastExecutionReportUrl', 'lang', 'enabled', 'location', 'browserName', 'isMobile', 'bandwidthUpstream', 'bandwidthDownstream', 'latency', 'isPrivate', 'adblock', 'screenHeight', 'screenWidth', 'tips'), _.pick(trackingData, (value, key) => {
		return key.startsWith('header_');
	}));

	return pickedPropItem;
}

module.exports = {
	flattenTrackingData
};
