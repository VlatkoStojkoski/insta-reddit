const snoowrap = require('snoowrap');
const { padImage } = require('./images');
const { readAsObject, appendID, downloadFile } = require('./utils');
const path = require('path');

class Saver {
	reddit;

	constructor(options) {
		this.reddit = new snoowrap(options);
		this.subreddit = options.subreddit;
		this.historyFile = options.historyFile;
		this.downloadPath = options.downloadPath;
		this.editPath = options.editPath;
	}

	async saveHottest(options) {
		try {
			let {
				historyFile = this.historyFile,
				downloadPath = this.downloadPath,
				editPath = this.editPath,
				padding = 80,
				subreddit = this.subreddit,
			} = { ...options };

			if (!historyFile) throw Error('No submission history file defined');

			const submissions = await this.reddit
				.getSubreddit(subreddit || this.subreddit)
				.getHot();

			for (const s of submissions) {
				const { url, id, title, author } = s;

				if (readAsObject(historyFile).includes(id)) continue; // Skip if submission already posted

				const ext = path.extname(url);
				const accepted = ['.png', '.jpg'];
				if (!accepted.includes(ext)) continue; // Skip if submission image doesn't have an image extension

				const scheme = (s) =>
					s
						.replace(/\{\{extension\}\}/g, ext)
						.replace(/\{\{id\}\}/g, id)
						.replace(/\{\{title\}\}/g, title);

				downloadPath =
					(downloadPath && scheme(downloadPath)) ||
					`images/${path.basename(url)}`;
				editPath = (editPath && scheme(editPath)) || downloadPath;

				await downloadFile(url, downloadPath);

				if (padding) await padImage(downloadPath, editPath, padding); // Pad image

				appendID(id, historyFile); // Add ID to posted submissions

				return {
					downloadPath,
					editPath,
					submission: s,
				};
			}
		} catch (error) {
			throw Error(error);
		}
	}
}

module.exports.Saver = Saver;
