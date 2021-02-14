const { AutoPoster } = require('./lib/autoPoster');

require('dotenv').config();

const bot = new AutoPoster({
	instagram: {
		username: process.env.IG_USERNAME,
		password: process.env.IG_PASSWORD,
	},
	reddit: {
		userAgent: process.env.REDDIT_USERAGENT,
		clientId: process.env.REDDIT_ID,
		clientSecret: process.env.REDDIT_SECRET,
		username: process.env.REDDIT_USERNAME,
		password: process.env.REDDIT_PASSWORD,
	},
	slack: {
		token: process.env.SLACK_BOT_TOKEN,
		signingSecret: process.env.SLACK_SIGNING_SECRET,
		channel: process.env.SLACK_CHANNEL,
	},
	subreddit: process.env.REDDIT_SUBREDDIT,
	historyFile: 'history.json',
	downloadPath: 'images/meme{{extension}}',
	caption:
		'{{title}}\nsource: {{author}}\n' +
		'.\n'.repeat(7) +
		'#meme #memes #bestmemes #instamemes #funny #funnymemes #dankmemes #edgymemes #dank #memesdaily #jokes #humor',
});

(async () => {
	await bot.init();

	await bot.run();
})();
