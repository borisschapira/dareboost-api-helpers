import { extend } from 'underscore';
import { doExport } from '../../io.mjs';
import { getMonitoringList } from '../../api-client/trackings/list.mjs';
import { getMonitoringReports } from '../../api-client/trackings/reports.mjs';
import percentile from 'percentile';

function getAvgValuesFromMonitoringReports(monitoringReports) {
	return extend(
		{
			score: monitoringReports.statistics.averageScore,
			requests: monitoringReports.statistics.averageRequests,
			loadTime: monitoringReports.statistics.averageLoadTime,
			weight: monitoringReports.statistics.averageWeight,
		},
		monitoringReports.statistics.averageTimings,
	);
}

function getpValuesFromMonitoringReports(p, monitoringReports) {
	return {
		score: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.score),
		),
		requests: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.requests),
		),
		loadTime: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.loadTime),
		),
		visuallyComplete: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.visuallyComplete),
		),
		firstByte: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.firstByte),
		),
		domInteractive: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.domInteractive),
		),
		loadEvent: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.loadEvent),
		),
		startRender: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.startRender),
		),
		speedIndex: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.speedIndex),
		),
		loadEventStart: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.loadEventStart),
		),
		lastByte: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.lastByte),
		),
		domLoading: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.domLoading),
		),
		domContentLoadedEventStart: percentile(
			p,
			monitoringReports.monitoringData.map(
				(x) => x.timings.domContentLoadedEventStart,
			),
		),
		domContentLoadedEventEnd: percentile(
			p,
			monitoringReports.monitoringData.map(
				(x) => x.timings.domContentLoadedEventEnd,
			),
		),
		domComplete: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.domComplete),
		),
		firstContentfulPaint: percentile(
			p,
			monitoringReports.monitoringData.map(
				(x) => x.timings.firstContentfulPaint,
			),
		),
		firstConsistentlyInteractive: percentile(
			p,
			monitoringReports.monitoringData.map(
				(x) => x.timings.firstConsistentlyInteractive,
			),
		),
		largestContentfulPaint: percentile(
			p,
			monitoringReports.monitoringData.map(
				(x) => x.timings.largestContentfulPaint,
			),
		),
		totalBlockingTime: percentile(
			p,
			monitoringReports.monitoringData.map((x) => x.timings.totalBlockingTime),
		),
		maxPotentialFirstInputDelay: percentile(
			p,
			monitoringReports.monitoringData.map(
				(x) => x.timings.maxPotentialFirstInputDelay,
			),
		),
		cumulativeLayoutShift: percentile(
			p,
			monitoringReports.monitoringData.map(
				(x) => x.timings.cumulativeLayoutShift,
			),
		),
	};
}

(async () => {
	const valuesData = [];

	const monitoringList = await getMonitoringList();

	const enabledMonitorings = monitoringList.monitorings.filter(
		(x) => x.enabled,
	);

	for (let i = 0; i < enabledMonitorings.length; i++) {
		const monitor = enabledMonitorings[i];

		console.log(monitor.name);

		const monitoringReports = await getMonitoringReports(
			monitor.id,
			30240,
			90,
			false,
		);

		if (!monitoringReports || monitoringReports.status != 200) {
			console.log('\t Ko.');
			continue;
		}

		const computeAlgorithm = 'AVERAGE';
		if (process.env.PERCENTILE || process.env.DB_PERCENTILE) {
			valuesData.push(
				extend(
					{
						url: monitor.url,
						name: monitor.name,
					},
					getpValuesFromMonitoringReports(
						process.env.PERCENTILE || process.env.DB_PERCENTILE,
						monitoringReports,
					),
				),
			);
		} else {
			valuesData.push(
				extend(
					{
						url: monitor.url,
						name: monitor.name,
					},
					getAvgValuesFromMonitoringReports(monitoringReports),
				),
			);
		}
	}

	doExport(valuesData, 'avgMonitoringValues');
})();
