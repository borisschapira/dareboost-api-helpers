const fs = require('fs');
const getMonitoringLastExecutions = require('./api/client/trackings/last-executions');

const filepath = 'output.json';

getMonitoringLastExecutions()
	.then(data => {
		const jsonContent = JSON.stringify(data);
		fs.writeFile(filepath, jsonContent, 'utf8', err => {
			if (err) {
				console.log('An error occured while writing JSON Object to File.');
				return console.log(err);
			}

			console.log('JSON file ' + filepath + ' has been saved.');
		});
	});
