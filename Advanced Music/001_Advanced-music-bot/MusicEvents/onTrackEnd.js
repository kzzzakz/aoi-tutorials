module.exports = {
	name: "onTrackEnd",
	type: "trackEnd",
	channel: "$getServerVar[MUSIC_channel]",
	code: `
      $loop[1;{"title":"$replaceText[$songInfo[title];";\"]","thumbnail":"$replaceText[$songInfo[thumbnail];undefined;]","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
  `
};