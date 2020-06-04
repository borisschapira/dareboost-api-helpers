const _ = require('underscore');
const transformations = require('../../transformations');
const io = require('../../io');
var Stats = require('fast-stats').Stats;
const getMonitoringList = require('../../api-client/trackings/list');
const getMonitoringReports = require('../../api-client/trackings/reports');

(async () => {
	const monitoringList = await getMonitoringList();
	const allData = [];
	const results = [];

	const observedInfos = ['score', 'weight'];
	const observedTimings = ['firstByte', 'startRender', 'speedIndex'];

	for (const i in monitoringList.monitorings) {
		const monitor = monitoringList.monitorings[i];

		const monitoringReports = await getMonitoringReports(
			monitor.id,
			30240,
			90,
			false
		);

		if (!monitoringReports.monitoringData) continue;

		const resultTemplate = {
			url: monitor.url,
			name: monitor.name,
			id: monitor.id,
		};

		// Filter to keep only the useful data
		const observedData = monitoringReports.monitoringData.map((data) =>
			_.extend(
				_.pick(data, observedInfos),
				_.pick(data.timings, ...observedTimings)
			)
		);

		allData.push(...observedData);

		[...observedInfos, ...observedTimings].forEach((metric) => {
			const studiedStats = new Stats().push(
				observedData.map((data) => data[metric])
			);

			let result = {};
			result[metric] = {
				mean: studiedStats.amean().toFixed(0),
				median: studiedStats.median().toFixed(0),
				p80: studiedStats.percentile(80).toFixed(0),
				p90: studiedStats.percentile(90).toFixed(0),
				p95: studiedStats.percentile(95).toFixed(0),
				p99: studiedStats.percentile(99).toFixed(0),
				max: studiedStats.range()[1],
			};
			results.push(_.extend({}, resultTemplate, result));
		});
	}

	[...observedInfos, ...observedTimings].forEach((metric) => {
		const studiedStats = new Stats().push(allData.map((data) => data[metric]));
		let result = {};
		result[metric] = {
			mean: studiedStats.amean().toFixed(0),
			median: studiedStats.median().toFixed(0),
			p80: studiedStats.percentile(80).toFixed(0),
			p90: studiedStats.percentile(90).toFixed(0),
			p95: studiedStats.percentile(95).toFixed(0),
			p99: studiedStats.percentile(99).toFixed(0),
			max: studiedStats.range()[1],
		};
		results.push(_.extend({ url: '', id: '', name: 'All' }, result));
	});

	io.doExport(
		transformations.flattenObjects(results),
		'page_monitor_statistics'
	);
})();
