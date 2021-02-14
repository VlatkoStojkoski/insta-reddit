# Insta-Reddit

Insta-Reddit is a JavaScript library for easily posting the hottest submission from Reddit to Instagram with built-in image padding and Slack messages.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install insta-reddit.

```bash
npm install insta-reddit
```

## Usage

```javascript
const { AutoPoster } = require('insta-reddit');

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
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
