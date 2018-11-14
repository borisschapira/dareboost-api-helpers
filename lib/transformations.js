const _ = require('underscore');
const Entities = require('html-entities').AllHtmlEntities;

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

	const defaultFields = ['id', 'trackingUrl', 'url', 'name', 'state', 'lastExecution', 'lastExecutionReportUrl', 'score', 'lang', 'enabled', 'location', 'browserName', 'isMobile', 'bandwidthUpstream', 'bandwidthDownstream', 'latency', 'isPrivate', 'adblock', 'screenHeight', 'screenWidth', 'headers'];
	fields = fields || defaultFields;

	const pickedPropItem = _.extend({}, _.pick(trackingData, ...fields));
	if (fields.includes('headers')) {
		_.extend(pickedPropItem, _.pick(trackingData, (value, key) => {
			return key.startsWith('header_');
		}));
	}

	return pickedPropItem;
}

function flattenEachTrackingData(iterableOftrackingData) {
	return _.map(iterableOftrackingData, item => flattenTrackingData(item));
}

function groupTipsFromTrackingData(trackingData) {
	const entities = new Entities();
	const tipsData = [];

	for (const trackingDataItem of trackingData) {
		for (const tip of trackingDataItem.tips) {
			const tipData = _.omit(flattenTrackingData(trackingDataItem, ['id', 'lastExecutionReportUrl', 'location', 'browserName', 'tips']), 'tips');
			_.each(tip, (value, key) => {
				const extension = {};
				if (key === 'name' || key === 'category' || key === 'advice') {
					if(value != null) {
						value = value.replace(/(?:\r\n|\r|\n)/g, '<br>');
					}
					extension['tip_' + key] = entities.decode(value);
				} else {
					extension['tip_' + key] = value;
				}
				_.extend(tipData, extension);
			});
			tipsData.push(tipData);
		}
	}
	return tipsData;
}

module.exports = {
	flattenEachTrackingData,
	groupTipsFromTrackingData
};
