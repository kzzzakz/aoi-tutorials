module.exports = [
	{
		name: "embedUpdate",
		type: "awaited",
		$if: "v4",
		code: `
    $if[$awaitData[uptime]!=none]
        $if[$replaceText[$awaitData[title];undefined;]!=]
            $editMessage[$getServerVar[MUSIC_embedMessage];{newEmbed:
                {title: Now playing: $awaitData[title]}
                {description:
                    $djsEval[
                        d.data.array = d.data.array.filter(_ => _);
                        d.data.array.shift();
                        const msg = d.data.array.slice(0, 10).map((str, i) => "[" + Math.floor(i+2) + "]. " + str.replace(/\\n/g, "")).reverse().join("\\n") 
                        d.data.array.length > 10 ? "And " + Math.floor(d.data.array.length - 10) + " more...\\n" + msg : msg || "There's no more songs after this one! Add some:)";
                    ;yes]
                }
                {footer:To play music send a message here with the title of the song!}
                {image:$awaitData[thumbnail]}
                {color:#e3b5d9}
            };$getServerVar[MUSIC_channel]]
            $textSplit[$queue[1;10000;{title}$clientId];$clientId]
        $else
            $editMessage[$getServerVar[MUSIC_embedMessage];{newEmbed:
                {title: Queue empty.}
                {thumbnail:$userAvatar[$clientId]}
                {footer:To play music send a message here with the title of the song!}
                {color:#e3b5d9}
            };$getServerVar[MUSIC_channel]]
        $endif
    $else
        $editMessage[$getServerVar[MUSIC_embedMessage];{newEmbed:
            {title: Queue empty.}
            {thumbnail:$userAvatar[$clientId]}
            {footer:To play music send a message here with the title of the song!}
            {color:#e3b5d9}
        };$getServerVar[MUSIC_channel]]
    $endif

    $onlyIf[$messageExists[$getServerVar[MUSIC_embedMessage];$getServerVar[MUSIC_channel]]==true;{execute:createNewMusicEmbed}]
    $onlyIf[$serverChannelExists[$getServerVar[MUSIC_channel];$awaitData[guild]]==true;{execute:clearMusicVariables}]
    $onlyIf[$getServerVar[MUSIC_channel]!=;]
    `
	},
	{
		name: "clearMusicVariables",
		type: "awaited",
		code: `
        $setServerVar[MUSIC_channel;]
        $setServerVar[MUSIC_embedMessage;]
    `
	},
	{
		name: "createNewMusicEmbed",
		type: "awaited",
		$if: "v4",
		code: `
        $if[$hasPlayer==true]
            $loop[1;{"title":"$replaceText[$songInfo[title];";\"]","thumbnail":"$songInfo[thumbnail]","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
        $else
            $loop[1;{"title":"undefined","thumbnail":"undefined","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
        $endif

        $setServerVar[MUSIC_embedMessage;$get[message]]
        $let[message;$channelSendMessage[$get[channel];{newEmbed:
            {title: Loading...}
        };yes]]

        $if[$getServerVar[MUSIC_embedMessage]!=]
            $onlyIf[$messageExists[$replaceText[$replaceText[$checkCondition[$awaitData[message]==];true;$getServerVar[MUSIC_embedMessage]];false;$awaitData[message]];$get[channel]]==false;]
        $endif

        $let[channel;$replaceText[$replaceText[$checkCondition[$awaitData[channel]==];true;$getServerVar[MUSIC_channel]];false;$awaitData[channel]]]
    `
	}
];
