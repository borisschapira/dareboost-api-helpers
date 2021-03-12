const _ = require('underscore');
const camelCase = require('camelcase');
const { decode } = require('html-entities');

function flattenObject(o, result = {}, prefix = '') {
	Object.keys(o).forEach((key) => {
		if (isArray(o[key]) || isObject(o[key])) {
			switch (key) {
				case 'cookies':
					for (let c = 0; c < o[key].length; c++) {
						result[
							camelCase(prefix + 'cookie_' + o[key][c].name)
						] = flattenCookie(o[key][c]);
					}

					break;
				case 'header':
					for (let h = 0; h < o[key].length; h++) {
						result[camelCase(prefix + 'header_' + o[key][h].key)] =
							o[key][h].key + ': ' + o[key][h].value;
					}

					break;
				default:
					flattenObject(o[key], result, prefix + key + '_');
			}
		} else if (key == 'lastExecution') {
			result[camelCase(prefix + key)] = new Date(o[key]).toISOString();
		} else {
			result[camelCase(prefix + key)] = o[key];
		}
	});

	return result;
}

function flattenObjects(iterable) {
	return _.map(iterable, (item) => flattenObject(item));
}

function flattenTrackingData(trackingData, fields = null) {

	trackingData.name = decode(trackingData.name);

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
		trackingData.lastExecution = new Date(
			trackingData.lastExecution
		).toISOString();
	}

	if (trackingData.header && trackingData.header.length > 0) {
		const headerLength = trackingData.header.length;
		for (let i = 0; i < headerLength; i++) {
			trackingData['header_' + trackingData.header[i].key] =
				trackingData.header[i].value;
		}
	}

	if (trackingData.id) {
		trackingData.trackingUrl =
			'https://www.dareboost.com/' +
			(trackingData.lang ? trackingData.lang : 'en') +
			'/tracking/edit/' +
			trackingData.id;
	}

	if (trackingData.config && trackingData.config.repeatedView) {
		trackingData.repeatedView = trackingData.config.repeatedView;
	}

	if (trackingData.config && trackingData.config.http2Disabled) {
		trackingData.http2Disabled = trackingData.config.http2Disabled;
	}

	if (
		trackingData.config &&
		trackingData.config.cookies &&
		trackingData.config.cookies.length > 0
	) {
		const cookiesLength = trackingData.config.cookies.length;
		for (let i = 0; i < cookiesLength; i++) {
			trackingData[
				'cookie_' + trackingData.config.cookies[i].name
			] = flattenCookie(trackingData.config.cookies[i]);
		}
	}

	const defaultFields = [
		'id',
		'trackingUrl',
		'url',
		'name',
		'state',
		'lastExecution',
		'lastExecutionReportUrl',
		'score',
		'lang',
		'frequency',
		'enabled',
		'location',
		'isPrivate',
		'browserName',
		'isMobile',
		'bandwidthUpstream',
		'bandwidthDownstream',
		'latency',
		'isPrivate',
		'adblock',
		'screenHeight',
		'screenWidth',
		'headers',
		'repeatedView',
		'http2Disabled',
		'animationsStopped',
	];
	fields = fields || defaultFields;

	const pickedPropItem = _.extend({}, _.pick(trackingData, ...fields));
	if (fields.includes('headers')) {
		_.extend(
			pickedPropItem,
			_.pick(trackingData, (value, key) => {
				return key.startsWith('header_') || key.startsWith('cookie_');
			})
		);
	}

	return pickedPropItem;
}

function flattenCookie(cookieData) {
	return `${cookieData.name}=${cookieData.value}; Path=${cookieData.path}; Domain=${cookieData.domain}`;
}

function flattenEachTrackingData(iterableOftrackingData) {
	return _.map(iterableOftrackingData, (item) => flattenTrackingData(item));
}

function flattenScenariosReportSummariesData(scenariosReports) {
	const summaryData = [];
	for (const scenario of scenariosReports) {
		for (const report of scenario.data.reports) {
			summaryData.push({
				id: scenario.data.id,
				name: scenario.data.name,
				timestamp: report.date,
				date: csvDate(new Date(report.date)),
				hour: csvHour(new Date(report.date)),
				status: getReportStatus(
					scenario.error,
					report.summary.browserError,
					report.summary.fail
				),
			});
		}
	}

	return _.sortBy(summaryData, 'timestamp');
}

function getReportStatus(error, browserError, nbFail) {
	if (error) {
		return 'Failed';
	}

	if (nbFail > 0) {
		return 'Check failed';
	}

	// If (browserError > 0) return "Alert";
	return 'Ok';
}

function groupTipsFromTrackingData(trackingData) {
	const tipsData = [];

	for (const trackingDataItem of trackingData) {
		if (trackingDataItem.tips) {
			for (const tip of trackingDataItem.tips) {
				const tipData = _.omit(
					flattenTrackingData(trackingDataItem, [
						'id',
						'lastExecutionReportUrl',
						'location',
						'browserName',
						'tips',
					]),
					'tips'
				);
				_.each(tip, (value, key) => {
					const extension = {};
					if (key === 'name' || key === 'category' || key === 'advice') {
						if (value != null) {
							value = value.replace(/(?:\r\n|\r|\n)/g, '<br>');
						}

						extension['tip_' + key] = decode(value);
					} else {
						extension['tip_' + key] = value;
					}

					_.extend(tipData, extension);
				});
				tipsData.push(tipData);
			}
		}
	}

	return tipsData;
}

function csvDate(d) {
	return [
		d.getDate().padLeft(),
		(d.getMonth() + 1).padLeft(),
		d.getFullYear(),
	].join('/');
}

function csvHour(d) {
	return [
		d.getHours().padLeft(),
		d.getMinutes().padLeft(),
		d.getSeconds().padLeft(),
	].join(':');
}

function isObject(o) {
	return o === new Object(o);
}

function isArray(arr) {
	return Array.isArray(arr);
}

Number.prototype.padLeft = function (base, chr) {
	const len = String(base || 10).length - String(this).length + 1;
	return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

module.exports = {
	flattenEachTrackingData,
	groupTipsFromTrackingData,
	flattenObject,
	flattenObjects,
	flattenScenariosReportSummariesData,
};
