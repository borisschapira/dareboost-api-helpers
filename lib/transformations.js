const _ = require('underscore');
const Entities = require('html-entities').XmlEntities;

function flattenTrackingData(trackingData, fields = null) {

	const entities = new Entities();

	trackingData.name = entities.decode(trackingData.name);

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

	const defaultFields = ['id', 'trackingUrl', 'url', 'name', 'state', 'lastExecution', 'lastExecutionReportUrl', 'lang', 'enabled', 'location', 'browserName', 'isMobile', 'bandwidthUpstream', 'bandwidthDownstream', 'latency', 'isPrivate', 'adblock', 'screenHeight', 'screenWidth', 'tips', 'headers'];
	fields = fields || defaultFields;

	const pickedPropItem = _.extend({}, _.pick(trackingData, ...fields));
	if(fields.includes('headers')) {
		_.extend(pickedPropItem, _.pick(trackingData, (value, key) => {
			return key.startsWith('header_');
		}));
	}

	return pickedPropItem;
}

function groupTipsFromTrackingData(trackingData) {
	const entities = new Entities();
	let tipsData = [];
	const l = trackingData.length;
	for (trackingDataItem of trackingData) {
		trackingDataItem = flattenTrackingData(trackingDataItem, ['id', 'trackingUrl', 'url', 'name', 'state', 'lastExecution', 'lastExecutionReportUrl', 'lang', 'enabled', 'location', 'browserName', 'isMobile', 'tips']);
		for (tip of trackingDataItem.tips) {
			let tipData = _.omit(trackingDataItem,'tips');
			for (tipAttributeKey in tip) {
				let extension = {};
				extension["tip_" + tipAttributeKey] = entities.decode(tip[tipAttributeKey]);
				_.extend(tipData, extension);
			}
			tipsData.push(tipData);
		}
	}
	return tipsData;
}

module.exports = {
	flattenTrackingData,
	groupTipsFromTrackingData
};
