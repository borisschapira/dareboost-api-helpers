import { flattenScenariosReportSummariesData } from '../../transformations.mjs';
import { doExport } from '../../io.mjs';
import { getScenarioList } from '../../api-client/scenario/list.mjs';
import { getScenarioReports } from '../../api-client/scenario/reports.mjs';

(async () => {
	const allScenarioReports = [];
	const scenarioList = await getScenarioList();

	for (const i in scenarioList.scenarios) {
		const scenario = scenarioList.scenarios[i];
		let scenarioReports = await getScenarioReports(
			scenario.id,
			30240,
			90,
			false,
		);
		if (scenarioReports.scenario) {
			allScenarioReports.push({
				error: false,
				data: scenarioReports.scenario,
			});
		}

		scenarioReports = await getScenarioReports(scenario.id, 30240, 90, true);
		if (scenarioReports.scenario) {
			allScenarioReports.push({
				error: true,
				data: scenarioReports.scenario,
			});
		}
	}

	doExport(
		flattenScenariosReportSummariesData(allScenarioReports),
		'scenarioStatuses',
	);
})();
