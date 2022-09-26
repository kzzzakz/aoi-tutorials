module.exports = {
	name: "newTrack",
	type: "trackStart",
	channel: "$getServerVar[MUSIC_channel]",
	code: `
		$loop[1;{"title":"$replaceText[$songInfo[title];";\"]","thumbnail":"$songInfo[thumbnail]","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
  `
};