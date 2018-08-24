// Export folder
const exportFolder = 'output';

// CSV, JSON or both (in an array).
// If empty, will export to the console
const exportTypes = [
	'CSV',
	'JSON'
];

exports.config = {
	exportFolder,
	exportTypes
};
