const fs = require('fs');
const path = require('path');
const request = require('request');
const Json2csvParser = require('json2csv').Parser;
const { config } = require('../user-config');

function getFilepath(filename, extension) {
	const filepathFolder = path.join(__dirname, '..', config.exportFolder);

	const filenameComponents = [];
	if (config.filename.displayTimestamp) {
		filenameComponents.push(new Date().getTime());
	}

	if (process.env.PREFIX || process.env.DB_FILENAME) {
		filenameComponents.push(process.env.PREFIX || process.env.DB_FILENAME);
	}

	if (config.filename.displayKeyPreview) {
		const token = process.env.API_TOKEN || process.env.DB_API_TOKEN;
		filenameComponents.push(token.substring(0, 5));
	}

	filenameComponents.push(filename);

	return path.join(
		filepathFolder,
		filenameComponents.join('_') + '.' + extension
	);
}

function doExport(data, filename) {
	function writeFile(content, filepath, filetype) {
		fs.writeFile(filepath, content, 'utf8', (err) => {
			if (err) {
				console.log('An error occured while writing JSON Object to File.', err);
			}

			console.log(`${filetype} file ${filepath} has been saved.`);
		});
	}

	const exportFunctions = {
		toJSON(data, filepath) {
			writeFile(JSON.stringify(data), filepath, 'JSON');
		},
		toCSV(data, filepath) {
			const parser = new Json2csvParser({
				delimiter: process.env.CSV_SEPARATOR || '\t',
			});
			writeFile(parser.parse(data), filepath, 'CSV');
		},
	};

	for (const exportType of config.exportTypes) {
		const filepath = getFilepath(filename, exportType.toLowerCase());
		exportFunctions['to' + exportType.toUpperCase()](data, filepath);
	}
}

function download(uri, filename, callback) {
	request.head(uri, (err, res, body) => {
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);

		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
}

module.exports = {
	doExport,
	download,
};
