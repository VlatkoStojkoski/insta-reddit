const { App } = require('@slack/bolt');

class Notifier {
	app;

	constructor(options) {
		this.app = new App(options);
		this.token = options.token;
		this.channel = options.channel;
	}

	async notify(text, channel = undefined) {
		try {
			const res = await this.app.client.chat.postMessage({
				token: this.token,
				channel: channel || this.channel,
				text,
			});

			return res;
		} catch (error) {
			throw Error(error);
		}
	}
}

module.exports.Notifier = Notifier;
