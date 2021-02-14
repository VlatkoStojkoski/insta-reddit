const { Poster } = require('./poster');
const { Saver } = require('./saver');
const { Notifier } = require('./notifier');
const { sleep } = require('./utils');

class AutoPoster {
	saver;
	notifier;
	poster;

	constructor(options) {
		this.options = options;

		this.saver = new Saver({
			userAgent: options.reddit.userAgent,
			clientId: options.reddit.clientId,
			clientSecret: options.reddit.clientSecret,
			username: options.reddit.username,
			password: options.reddit.password,
			subreddit: options.subreddit,
			historyFile: options.historyFile,
			downloadPath: options.downloadPath,
			editPath: options.editPath,
		});

		this.notifier = options.slack
			? new Notifier({
					token: options.slack.token,
					signingSecret: options.slack.signingSecret,
					channel: options.slack.channel,
			  })
			: { notify: () => {} };

		this.poster = new Poster({
			username: options.instagram.username,
			password: options.instagram.password,
		});
	}

	async init() {
		try {
			await this.poster.login();
		} catch (error) {
			console.error(error);
			this.notifier.notify(`There's been an error!\n${error}`);
		}
	}

	async run() {
		try {
			const hottest = await this.saver.saveHottest();

			const downloadMsg = `Downloaded submission #${hottest.submission.id} to ${hottest.downloadPath}`;
			console.log(downloadMsg);
			this.notifier.notify(downloadMsg);

			const scheme = (s) =>
				s
					.replace(/\{\{title\}\}/g, hottest.submission.title)
					.replace(/\{\{author\}\}/g, `u/${hottest.submission.author.name}`);

			const { upload_id, media } = await this.poster.postPhoto({
				caption: scheme(this.options.caption),
				file: hottest.editPath,
			});

			const successMsg =
				`Posted photo with ID: ${upload_id} to account @${media.user.username}.\n\n` +
				`Instagram image upload URL: ${media.image_versions2.candidates[0].url}\n\n` +
				`Caption:\n${media.caption.text}`;
			console.log(successMsg);
			this.notifier.notify(successMsg);
		} catch (error) {
			console.error(error);
			this.notifier.notify(`There's been an error!\n${error}`);
		}
	}
}

module.exports.AutoPoster = AutoPoster;
