import { createWriteStream, writeFile } from 'fs';
import path from 'path';
import { Parser } from '@json2csv/plainjs';
import config from '../user-config.mjs';
import { Axios } from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
		filenameComponents.join('_') + '.' + extension,
	);
}

function doExport(data, filename) {
	function doWriteFile(content, filepath, filetype) {
		writeFile(filepath, content, 'utf8', (err) => {
			if (err) {
				console.log('An error occured while writing JSON Object to File.', err);
			}

			console.log(`${filetype} file ${filepath} has been saved.`);
		});
	}

	const exportFunctions = {
		toJSON(data, filepath) {
			if (!data.length) {
				console.log('No data to export to JSON.');
				return;
			}
			doWriteFile(JSON.stringify(data), filepath, 'JSON');
		},
		toCSV(data, filepath) {
			if (!data.length) {
				console.log('No data to export to CSV.');
				return;
			}
			const parser = new Parser({
				delimiter: process.env.CSV_SEPARATOR || '\t',
			});
			doWriteFile(parser.parse(data), filepath, 'CSV');
		},
	};

	for (const exportType of config.exportTypes) {
		const filepath = getFilepath(filename, exportType.toLowerCase());
		exportFunctions['to' + exportType.toUpperCase()](data, filepath);
	}
}

async function download(fileUrl, outputLocationPath, callback) {
	const writer = createWriteStream(outputLocationPath);

	return Axios({
		method: 'get',
		url: fileUrl,
		responseType: 'stream',
	}).then((response) => {
		return new Promise((resolve, reject) => {
			response.data.pipe(writer);
			let error = null;
			writer.on('error', (err) => {
				error = err;
				writer.close();
				reject(err);
			});
			writer.on('close', () => {
				if (!error) {
					resolve(true);
				}
			});
		});
	});
}

export { doExport, download };
