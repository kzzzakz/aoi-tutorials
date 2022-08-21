const { LoadCommands, AoiClient } = require("aoi.js");
const { token, prefix } = require("./config.json");

const bot = new AoiClient({
	token,
	prefix,
	intents: ["GUILDS", "GUILD_MESSAGES"]
});

// Events
bot.onMessage();

// Command handler
const CommandHandler = new LoadCommands(bot);
CommandHandler.load(bot.cmd, /** path: */ "./Commands");

// Ready Event
bot.readyCommand({
	channel: "",
	code: `$log[Ready on $userTag[$clientID]]`
});
