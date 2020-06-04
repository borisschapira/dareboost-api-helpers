const util = require('util');
const _ = require('underscore');
const transformations = require('../../transformations');
const io = require('../../io');
const getScenarioList = require('../../api-client/scenario/list');
const getScenarioReports = require('../../api-client/scenario/reports');

(async () => {
	const allScenarioReports = [];
	const scenarioList = await getScenarioList();

	for (const i in scenarioList.scenarios) {
		const scenario = scenarioList.scenarios[i];
		scenarioReports = await getScenarioReports(scenario.id, 30240, 90, false);
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

	io.doExport(
		transformations.flattenScenariosReportSummariesData(allScenarioReports),
		'scenarioStatuses'
	);
})();
