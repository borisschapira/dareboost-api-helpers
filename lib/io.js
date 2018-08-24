const fs = require('fs');
const path = require('path');
const Json2csvParser = require('json2csv').Parser;
const {config} = require('../user-config');

function getFilepath(filename, extension) {
	const filepathFolder = path.join(__dirname, '..', config.exportFolder);

	const filenameComponents = [];
	if (config.filename.displayTimestamp) {
		filenameComponents.push((new Date()).getTime());
	}
	if (config.filename.displayKeyPreview) {
		filenameComponents.push(process.env.DB_API_TOKEN.substring(0, 5));
	}
	filenameComponents.push(filename);

	return path.join(filepathFolder, filenameComponents.join('_') + '.' + extension);
}

function doExport(data, filename) {
	function writeFile(content, filepath) {
		fs.writeFile(filepath, content, 'utf8', err => {
			if (err) {
				console.log('An error occured while writing JSON Object to File.', err);
			}

			console.log('JSON file ' + filepath + ' has been saved.');
		});
	}

	const exportFunctions = {
		toJSON(data, filepath) {
			writeFile(JSON.stringify(data), filepath);
		},
		toCSV(data, filepath) {
			const parser = new Json2csvParser({
				delimiter: '\t'
			});
			writeFile(parser.parse(data), filepath);
		}
	};

	for (const exportType of config.exportTypes) {
		const filepath = getFilepath(filename, exportType.toLowerCase());
		exportFunctions['to' + exportType.toUpperCase()](data, filepath);
	}
}

module.exports = {
	doExport
};
