const { default: axios } = require('axios');
const fs = require('fs');

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const downloadFile = (url, output) =>
	new Promise(async (resolve, reject) => {
		const { data } = await axios({
			method: 'get',
			url,
			responseType: 'stream',
		}); // GET file from url as stream

		const stream = data.pipe(fs.createWriteStream(output)); // Write stream to file

		stream.on('finish', () => resolve(output)); // Return download path only after download stream ends

		stream.on('error', (err) => reject(err));
	});

const readAsObject = (file) => {
	const posted = fs.readFileSync(file);
	return JSON.parse(posted);
}; // Return array of ID's of already posted submissions

const appendID = (id, file) => {
	const posted = readAsObject(file);
	return fs.writeFileSync(file, JSON.stringify([...posted, id]), 'utf8');
}; // Add submission id to array in file

module.exports = { downloadFile, readAsObject, appendID, random, sleep };
