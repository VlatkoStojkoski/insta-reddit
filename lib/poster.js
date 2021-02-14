const { IgApiClient } = require('instagram-private-api');
const { promisify } = require('util');
const readFileAsync = promisify(require('fs').readFile);

class Poster {
	ig = new IgApiClient();

	constructor(credentials) {
		this.credentials = credentials;
	}

	async login() {
		try {
			const { username, password } = this.credentials;

			this.ig.state.generateDevice(username);
			await this.ig.simulate.preLoginFlow();

			await this.ig.account.login(username, password);

			process.nextTick(async () => await this.ig.simulate.postLoginFlow()); // Simulate human-like login behaviour

			return this.ig.account;
		} catch (error) {
			throw Error(error);
		}
	}

	async postPhoto(options) {
		try {
			const res = await this.ig.publish.photo({
				...options,
				file: await readFileAsync(options.file), // Read file from path as Buffer
			});

			return res;
		} catch (error) {
			throw Error(error);
		}
	}
}

module.exports.Poster = Poster;
