module.exports = {
	name: "setup",
	$if: "v4",
	code: `
        $loop[1;{"channel":"$get[channel]"};createNewMusicEmbed]
        $setServerVar[MUSIC_channel;$get[channel]]
        $setServerVar[MUSIC_embedMessage;]
        $let[channel;$createChannel[$guildID;$username[$clientID]-music;voice;yes]]
        $onlyIf[$serverChannelExists[$getServerVar[MUSIC_channel]]==false;You already have a channel created! <#$getServerVar[MUSIC_channel]>]
        $onlyPerms[managechannel;manageserver;You're missing one of these premissions: \`MANAGE_CHANNELS, MANAGE_SERVER\`{delete:5s}]
    `
};