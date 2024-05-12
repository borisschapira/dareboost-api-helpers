import { extend, pick } from 'underscore';
import { Stats } from 'fast-stats';
import { flattenObjects } from '../../transformations.mjs';
import { doExport } from '../../io.mjs';
import { getMonitoringList } from '../../api-client/trackings/list.mjs';
import { getMonitoringReports } from '../../api-client/trackings/reports.mjs';

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
			false,
		);

		if (!monitoringReports.monitoringData) continue;

		const resultTemplate = {
			url: monitor.url,
			name: monitor.name,
			id: monitor.id,
		};

		// Filter to keep only the useful data
		const observedData = monitoringReports.monitoringData.map((data) =>
			extend(pick(data, observedInfos), pick(data.timings, ...observedTimings)),
		);

		allData.push(...observedData);

		[...observedInfos, ...observedTimings].forEach((metric) => {
			const studiedStats = new Stats().push(
				observedData.map((data) => data[metric]),
			);

			const result = {};
			result[metric] = {
				mean: studiedStats.amean().toFixed(0),
				median: studiedStats.median().toFixed(0),
				p80: studiedStats.percentile(80).toFixed(0),
				p90: studiedStats.percentile(90).toFixed(0),
				p95: studiedStats.percentile(95).toFixed(0),
				p99: studiedStats.percentile(99).toFixed(0),
				max: studiedStats.range()[1],
			};
			results.push(extend({}, resultTemplate, result));
		});
	}

	[...observedInfos, ...observedTimings].forEach((metric) => {
		const studiedStats = new Stats().push(allData.map((data) => data[metric]));
		const result = {};
		result[metric] = {
			mean: studiedStats.amean().toFixed(0),
			median: studiedStats.median().toFixed(0),
			p80: studiedStats.percentile(80).toFixed(0),
			p90: studiedStats.percentile(90).toFixed(0),
			p95: studiedStats.percentile(95).toFixed(0),
			p99: studiedStats.percentile(99).toFixed(0),
			max: studiedStats.range()[1],
		};
		results.push(extend({ url: '', id: '', name: 'All' }, result));
	});

	doExport(flattenObjects(results), 'page_monitor_statistics');
})();
