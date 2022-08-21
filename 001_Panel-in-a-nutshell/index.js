const { LoadCommands, AoiClient } = require("aoi.js");
const { token, prefix } = require("./config.json");
const { Panel } = require("@akarui/aoi.panel");

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

const PanelObject = new Panel({
	username: "Zachary",
	password: "pan_con_azucar",
	secret: "aoijs", // Just write whatever the fuck you want <3
	port: 3000,
	bot,
	mainFile: "index.js",
	commands: "Commands"
});

// Panel events
PanelObject.loadPanel();
PanelObject.onError();

// Ready Event
bot.readyCommand({
	channel: "",
	code: `$log[Ready on $userTag[$clientID]]`
});
