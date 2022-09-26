const { LoadCommands, AoiClient, Voice } = require("aoi.js");
const { token, prefix } = require("./config.json");
const { Panel } = require("@akarui/aoi.panel");

const bot = new AoiClient({
	token,
	prefix,
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
});

// Events
bot.onMessage();

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
voice.onTrackEnd();

bot.variables(require("./Variables"));

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

bot.readyCommand({
	channel: "",
	async: true,
	code: `
	$djsEval[
		(async () => {
			const guilds = await d.client.guilds.fetch();

			guilds.map(async (SimpleGuild, i) => {
				const guild = await d.client.guilds.fetch(SimpleGuild.id)
				d.data.id = guild.id;

				const data = {
					message: (await d.client.db.get("main", "MUSIC_embedMessage_" + SimpleGuild.id))?.value,
					channel: (await d.client.db.get("main", "MUSIC_channel_" + SimpleGuild.id))?.value
				};

				if (!data.channel) return;
				const MusicChannel = await guild.channels.fetch(data.channel).catch(_ => null);

				if (!MusicChannel) {
					await d.client.db.delete("main", \`MUSIC_embedMessage_\${id}\`);
					await d.client.db.delete("main", \`MUSIC_channel_\${id}\`);
					return;
				}

				const MusicEmbed = await MusicChannel.messages.fetch(data.message).catch(_ => null);
				const { MessageEmbed } = require("discord.js");

				if (!MusicEmbed) {
					const msg = await MusicChannel.send({
						content: null,
						embeds: [
							new MessageEmbed()
								.setTitle("Queue empty.")
								.setFooter({ text: "To play music send a message here with the title of the song!" })
								.setThumbnail("$userAvatar[$clientId]")
								.setColor("#e3b5d9")
						]
					});

					return await d.client.db.set("main", "MUSIC_embedMessage", d.data.id, msg.id)
				}

				await MusicEmbed.edit({
					embeds: [
						new MessageEmbed()
							.setTitle("Queue empty.")
							.setFooter({ text: "To play music send a message here with the title of the song!" })
							.setThumbnail("$userAvatar[$clientId]")
							.setColor("#e3b5d9")
					]
				}).catch(async (_) => {
					await d.client.db.delete("main", \`MUSIC_embedMessage_\${id}\`);
					await d.client.db.delete("main", \`MUSIC_channel_\${id}\`);
				})
			});
		})();
	]
	`
});