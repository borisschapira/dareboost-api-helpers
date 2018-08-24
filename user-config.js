// Export folder
const exportFolder = 'output';

// Insert timestamp or
// 5 first caracters of the API key
// in the exported filenames
const filename = {
	displayTimestamp: false,
	displayKeyPreview: true
};

// CSV, JSON or both (in an array).
// If empty, will export to the console
const exportTypes = [
	'CSV',
	'JSON'
];

exports.config = {
	exportFolder,
	exportTypes,
	filename
};
