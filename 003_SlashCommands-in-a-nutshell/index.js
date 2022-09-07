const { LoadCommands, AoiClient, Voice } = require("aoi.js");
const { token, prefix } = require("./config.json");
const { Panel } = require("@akarui/aoi.panel");

const bot = new AoiClient({
	token,
	prefix,
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_PRESENCES"]
});

// Events
bot.onMessage();
bot.onInteractionCreate();

const voice = new Voice(
	bot,
	{
		cache: {
			cacheType: "Memory",
			enabled: true
		}
	},
	false
);

voice.onTrackStart();

// Command handler
const CommandHandler = new LoadCommands(bot);
CommandHandler.load(bot.cmd, /** path: */ "./Commands");
CommandHandler.load(voice.cmd, /** path: */ "./MusicEvents");

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
