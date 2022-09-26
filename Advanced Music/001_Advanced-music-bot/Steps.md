# Advanced music using aoi.js

So, what the fuck are we doing today?

- Preview here

Oh well, that looks pretty cool, so what should I do to-
First of all, listen here you little shit, yes, I know I’ve been out for a while but it’s been for good. Now going back to the video

We’re gonna need to go to the index file and make the music preparations, add the Voice thingy to the top part, add the `GUILD_VOICE_STATES` to the intents part, create the voice constant and add two events, these being `<Voice>.onTrackStart()` and `<Voice>.onTrackEnd()` after that we add the `MusicEvents` folder to the command handler and we’re done with the music part.

Next: We gotta create some variables
If you don’t know what variables are, you’re probably new and came here to copy and paste, if you know what they are tho, you can skip this part to the timestamp in the screen:

- Variables explanation:

They are a value that’s going to be stored in the database, with these we can create different values depending on the server, server member, channel, message or global user.

The variables we’re going to need this time are only two, you can call them however you want but for consistency let’s call them `MUSIC_embedMessage` and `MUSIC_channel` and both with a value of nothing (`””`)

You can add them, well, basically where you have the rest of variables like this:

Next thing we’re going to need is to create 2 events, one for when a new song starts playing and one for when the song ends and we’re going to put the same code on both of them, just like what you can see on screen.

```jsx
module.exports = {
	name: "newTrack",
	type: "trackStart",
	channel: "$getServerVar[MUSIC_channel]",
	code: `
			$loop[1;{"title":"$replaceText[$songInfo[title];";\"]","thumbnail":"$songInfo[thumbnail]","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
  `
};
```

```jsx
module.exports = {
	name: "onTrackEnd",
	type: "trackEnd",
	channel: "$getServerVar[MUSIC_channel]",
	code: `
      $loop[1;{"title":"$replaceText[$songInfo[title];";\"]","thumbnail":"$replaceText[$songInfo[thumbnail];undefined;]","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
  `
};
```

Next thing we’re going to do is make a file inside the `Commands` → `Music` folder called `embedUpdate.js` and we’re going to write:

```jsx
module.exports = [
	{
		name: "embedUpdate",
		type: "awaited",
		$if: "v4",
		code: ``
	},
	{
		name: "clearMusicVariables",
		type: "awaited",
		code: ``
	},
	{
		name: "createNewMusicEmbed",
		type: "awaited",
    $if: "v4",
		code: ``
	}
];
```

And you may be asking, *What are these for?* and my response to that is simple, there are the 3 awaited commands that we’re going to need for now, the first called `embedUpdate` is going to update the embed whenever a new song is added to the queue, a new song starts playing or a song ends.
The `clearMusicVariables` command is going to set both variables to the default value `""` .
And the last command, called `createNewMusicEmbed` is going to send a new message, a new embed which will contain the contents of the queue and the song playing right now.

Starting with the simple part, we’re going to finish the `clearMusicVariables` right away by putting inside of the code part this:

```jsx
{
		name: "clearMusicVariables",
		type: "awaited",
		code: `
    $setServerVar[MUSIC_channel;]
    $setServerVar[MUSIC_embedMessage;]
    `
}
```

And now we start to get serious, now in the `embedUpdate` command we’re going to have to put 3 conditions using `$onlyIf` like this:

```jsx
{
		name: "embedUpdate",
		type: "awaited",
		$if: "v4",
		code: `
    $onlyIf[$messageExists[$getServerVar[MUSIC_embedMessage];$getServerVar[MUSIC_channel]]==true;{execute:createNewMusicEmbed}]
    $onlyIf[$serverChannelExists[$getServerVar[MUSIC_channel];$awaitData[guild]]==true;{execute:clearMusicVariables}]
    $onlyIf[$getServerVar[MUSIC_channel]!=;]
    `
}
```

Next we’ll add an if like this:

```jsx
{
		name: "embedUpdate",
		type: "awaited",
		$if: "v4",
		code: `
    $if[$awaitData[uptime]!=none]
        
    $else
            
    $endif

    $onlyIf[$messageExists[$getServerVar[MUSIC_embedMessage];$getServerVar[MUSIC_channel]]==true;{execute:createNewMusicEmbed}]
    $onlyIf[$serverChannelExists[$getServerVar[MUSIC_channel];$awaitData[guild]]==true;{execute:clearMusicVariables}]
    $onlyIf[$getServerVar[MUSIC_channel]!=;]
    `
	}
```

Inside that if we’re going to add another one like this:

```jsx
{
		name: "embedUpdate",
		type: "awaited",
		$if: "v4",
		code: `
    $if[$awaitData[uptime]!=none]
        $if[$replaceText[$awaitData[title];undefined;]!=]
            
        $else
            
        $endif
    $else
        
    $endif

    $onlyIf[$messageExists[$getServerVar[MUSIC_embedMessage];$getServerVar[MUSIC_channel]]==true;{execute:createNewMusicEmbed}]
    $onlyIf[$serverChannelExists[$getServerVar[MUSIC_channel];$awaitData[guild]]==true;{execute:clearMusicVariables}]
    $onlyIf[$getServerVar[MUSIC_channel]!=;]
    `
	}
```

And now we can start coding the logic. First thing we want to make is a little embed for when there’s no queue nor song playing, meaning the queue is completely empty.

And it’s going to look like this:

```
	$editMessage[$getServerVar[MUSIC_embedMessage];{newEmbed:
     {title: Queue empty.}
     {thumbnail:$userAvatar[$clientId]}
     {footer:To play music send a message here with the title of the song!}
     {color:#e3b5d9}
  };$getServerVar[MUSIC_channel]]
```

Once we’re done with that we add it after both `$else`s

```jsx
{
		name: "embedUpdate",
		type: "awaited",
		$if: "v4",
		code: `
    $if[$awaitData[uptime]!=none]
        $if[$replaceText[$awaitData[title];undefined;]!=]
            
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
	}
```

And it’s already starting to take shape, next thing we’re going to need is to take the queue and split it using `$textSplit[$queue[1;10000;{title}$clientId];$clientId]` and next we gotta create an embed that shows the song currently playing and the queue, so we create one.

```
$editMessage[$getServerVar[MUSIC_embedMessage];{newEmbed:
    {title: Now playing: $awaitData[title]}
    {footer:To play music send a message here with the title of the song!}
    {image:$awaitData[thumbnail]}
    {color:#e3b5d9}
};$getServerVar[MUSIC_channel]]
```

And you may be thinking, but this is missing a description!
Yeah, I know, for the description we’re going to use this little JavaScript thing I did.

```jsx
d.data.array = d.data.array.filter(_ => _);
d.data.array.shift();
const msg = d.data.array.slice(0, 10).map((str, i) => "[" + Math.floor(i+2) + "]. " + str.replace(/\\n/g, "")).reverse().join("\\n") 
d.data.array.length > 10 ? "And " + Math.floor(d.data.array.length - 10) + " more...\\n" + msg : msg || "There's no more songs after this one! Add some:)";
```

Once we put that inside a `{description: $djsEval[<Script goes here>;yes]}` we can save the file and we’re done with the `embedUpdate` command.

It should look like this:

```jsx
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
	}
```

Next thing we’re doing is the `createNewMusicEmbed` command, first we’re going to need a way to check if there’s data about the guild to check if the message still exists, so we add this to the first line:

```jsx
{
		name: "createNewMusicEmbed",
		type: "awaited",
		$if: "v4",
		code: `
        $if[$getServerVar[MUSIC_embedMessage]!=]
            $onlyIf[$messageExists[$replaceText[$replaceText[$checkCondition[$awaitData[message]==];true;$getServerVar[MUSIC_embedMessage]];false;$awaitData[message]];$get[channel]];]
        $endif

        $let[channel;$replaceText[$replaceText[$checkCondition[$awaitData[channel]==];true;$getServerVar[MUSIC_channel]];false;$awaitData[channel]]]
    `
}
```

Next we create a message using `$channelSendMessage` to later save it’s ID in a `$let` like this:

```jsx
{
		name: "createNewMusicEmbed",
		type: "awaited",
		$if: "v4",
		code: `
				$setServerVar[MUSIC_embedMessage;$get[message]]
        $let[message;$channelSendMessage[$get[channel];{newEmbed:
            {title: Loading...}
        };yes]]

        $if[$getServerVar[MUSIC_embedMessage]!=]
            $onlyIf[$messageExists[$replaceText[$replaceText[$checkCondition[$awaitData[message]==];true;$getServerVar[MUSIC_embedMessage]];false;$awaitData[message]];$get[channel]];]
        $endif

        $let[channel;$replaceText[$replaceText[$checkCondition[$awaitData[channel]==];true;$getServerVar[MUSIC_channel]];false;$awaitData[channel]]]
    `
}
```

And last, we create a loop for the `embedUpdate` command and add a little message for when the channel and embed are created:

```jsx
{
		name: "createNewMusicEmbed",
		type: "awaited",
		$if: "v4",
		code: `
        The channel has been created <#$get[channel]>

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
            $onlyIf[$messageExists[$replaceText[$replaceText[$checkCondition[$awaitData[message]==];true;$getServerVar[MUSIC_embedMessage]];false;$awaitData[message]];$get[channel]];]
        $endif

        $let[channel;$replaceText[$replaceText[$checkCondition[$awaitData[channel]==];true;$getServerVar[MUSIC_channel]];false;$awaitData[channel]]]
    `
	}
```

And with that we should be done

Now we have to create a way for the user to send a message and the bot to receive it and then add the song to the queue, so, how do we do that? We create a new file in the same folder called `onMessagePlay.js` and we use this as a base:

```jsx
module.exports = {
	name: "$alwaysExecute",
	$if: "v4",
	code: `
    `
};
```

We are going to check some things using the next conditions and `$onlyIf`s:

```jsx
module.exports = {
	name: "$alwaysExecute",
	$if: "v4",
	code: `
		$onlyIf[$voiceId!=;You're not in a channel.{delete:5s}]
		$onlyIf[$stringStartsWith[$message;$getServerVar[prefix]]==false;]

		$onlyIf[$channelID==$getServerVar[MUSIC_channel];]
    `
};
```

And I want the bot to delete the messages the user sends so I’ll add a `$deletecommand` on top of the first `$onlyIf` like this:

```jsx
module.exports = {
	name: "$alwaysExecute",
	$if: "v4",
	code: `
		$onlyIf[$voiceId!=;You're not in a channel.{delete:5s}]
		$onlyIf[$stringStartsWith[$message;$getServerVar[prefix]]==false;]
		$deletecommand

		$onlyIf[$channelID==$getServerVar[MUSIC_channel];]
    `
};
```

Next we need to check if the bot is in any channel using `$if` , `$voiceId` and `$onlyIf` like this:

```jsx
module.exports = {
	name: "$alwaysExecute",
	$if: "v4",
	code: `
		$onlyIf[$voiceId==$voiceId[$clientId];You're not in the same channel{delete:5s}]
    $if[$hasPlayer==false]
	    $joinVc[$voiceId]
    $endif		
		$onlyIf[$voiceId!=;You're not in a channel.{delete:5s}]
		$onlyIf[$stringStartsWith[$message;$getServerVar[prefix]]==false;]
		$deletecommand

		$onlyIf[$channelID==$getServerVar[MUSIC_channel];]
    `
};
```

Next we add a way to check if it’s a spotify link, or a normal query using `$if` , `$checkContains` and playing the query using `$playTrack`

```jsx
module.exports = {
	name: "$alwaysExecute",
	$if: "v4",
	code: `
		$if[$checkContains[$message;https://open.spotify.com/track/;https://open.spotify.com/playlist/]==true]
      $let[msg;$playTrack[spotify;$message]]
    $else
      $let[msg;$playTrack[youtube;$message]]
    $endif

		$onlyIf[$voiceId==$voiceId[$clientId];You're not in the same channel{delete:5s}]
    $if[$hasPlayer==false]
	    $joinVc[$voiceId]
    $endif		
		$onlyIf[$voiceId!=;You're not in a channel.{delete:5s}]
		$onlyIf[$stringStartsWith[$message;$getServerVar[prefix]]==false;]
		$deletecommand

		$onlyIf[$channelID==$getServerVar[MUSIC_channel];]
    `
};
```

Next we make an embed to say “Hey this is the song that was added to the queue!”, in my case the title will use the `$get` function to get the title of the song and the color will be a pink one. With this it should be looking like this until now:

```jsx
module.exports = {
	name: "$alwaysExecute",
	$if: "v4",
	code: `
		$title[$get[msg]]
    $color[#e3b5d9]

		$if[$checkContains[$message;https://open.spotify.com/track/;https://open.spotify.com/playlist/]==true]
      $let[msg;$playTrack[spotify;$message]]
    $else
      $let[msg;$playTrack[youtube;$message]]
    $endif

		$onlyIf[$voiceId==$voiceId[$clientId];You're not in the same channel{delete:5s}]
    $if[$hasPlayer==false]
    $joinVc[$voiceId]
    $endif		
		$onlyIf[$voiceId!=;You're not in a channel.{delete:5s}]
		$onlyIf[$stringStartsWith[$message;$getServerVar[prefix]]==false;]
		$deletecommand

		$onlyIf[$channelID==$getServerVar[MUSIC_channel];]
    `
};
```

And now, as a really important part “How do I make it so the thumbnail of the embed is the thumbnail of the song that I just added? How do I make the main embed update?”
Using `$if` and `$loop` we can get the effect of an embed with the queue being updated in real time like this:

```jsx
module.exports = {
	name: "$alwaysExecute",
	$if: "v4",
	code: `
    $deleteIn[5s]
    $if[$hasPlayer==true]
      $loop[1;{"title":"$replaceText[$songInfo[title];";\"]","thumbnail":"$songInfo[thumbnail]","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
      $thumbnail[$songInfo[thumbnail;$math[$queueLength-1]]]
    $else
      $thumbnail[$songInfo[thumbnail]]
    $endif

    $title[$get[msg]]
    $color[#e3b5d9]
    
    $if[$checkContains[$message;https://open.spotify.com/track/;https://open.spotify.com/playlist/]==true]
      $let[msg;$playTrack[spotify;$message]]
    $else
      $let[msg;$playTrack[youtube;$message]]
    $endif
    
    
    $onlyIf[$voiceId==$voiceId[$clientId];You're not in the same channel{delete:5s}]
    $if[$hasPlayer==false]
    $joinVc[$voiceId]
    $endif
    $onlyIf[$voiceId!=;You're not in a channel.{delete:5s}]
    $onlyIf[$stringStartsWith[$message;$getServerVar[prefix]]==false;]
    $deletecommand

    $onlyIf[$channelID==$getServerVar[MUSIC_channel];]
    `
};
```

And with that we are done, now we need a way for the bot to create the channel and the embed where the music is gonna be requested, for this we create a new file in the same folder called `Setup.js` and start like this:

```jsx
module.exports = {
	name: "setup",
	$if: "v4",
	code: ``
};
```

Now for the main command, we’re going to check the permissions of the user so not everyone can create a channel like this:

```jsx
module.exports = {
	name: "setup",
	$if: "v4",
	code: `
        $onlyPerms[managechannel;manageserver;You're missing one of these premissions: \`MANAGE_CHANNELS, MANAGE_SERVER\`{delete:5s}]
    `
};
```

Now we create an `$onlyIf` that makes sure there’s no channel created:

```jsx
module.exports = {
	name: "setup",
	$if: "v4",
	code: `
        $onlyIf[$serverChannelExists[$getServerVar[MUSIC_channel]]==false;You already have a channel created! <#$getServerVar[MUSIC_channel]>]
        $onlyPerms[managechannel;manageserver;You're missing one of these premissions: \`MANAGE_CHANNELS, MANAGE_SERVER\`{delete:5s}]
    `
}
```

We create a channel using `$let` to save it’s id and use it later in the `$setServerVar` part like this:

```jsx
module.exports = {
	name: "setup",
	$if: "v4",
	code: `
        $setServerVar[MUSIC_channel;$get[channel]]
        $setServerVar[MUSIC_embedMessage;]
        $let[channel;$createChannel[$guildID;$username[$clientID]-music;voice;yes]]
        $onlyIf[$serverChannelExists[$getServerVar[MUSIC_channel]]==false;You already have a channel created! <#$getServerVar[MUSIC_channel]>]
        $onlyPerms[managechannel;manageserver;You're missing one of these premissions: \`MANAGE_CHANNELS, MANAGE_SERVER\`{delete:5s}]
    `
};
```

And now we create a new embed using the `$loop` function like this:

```jsx
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
```

And we’re done! Now we have a bot working but wait, we also have to check for the embed once the bot restarts so we have no unsolved embeds after a restart or some kind of crash, so we go to the `index.js` file and create or use a `ready` event, and since I want to keep your braincells working, I’ll ask you politely to just copy and paste this so it works properly:

```jsx
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
```

Btw, if you wanna change the color of the embed you have to search for the `.setColor` and change it’s inside to the color you want it to be.

Now, starting with the `play` command we can basically copy and paste the `onMessagePlay.js` logic like this:

```
module.exports = {
    name: "play",
    $if: "v4",
    code: `
    $deleteIn[5s]
    $if[$hasPlayer==true]
      $loop[1;{"title":"$replaceText[$songInfo[title];";\"]","thumbnail":"$songInfo[thumbnail]","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
      $thumbnail[$songInfo[thumbnail;$math[$queueLength-1]]]
    $else
      $thumbnail[$songInfo[thumbnail]]
    $endif

    $title[$get[msg]]
    $color[#e3b5d9]

    $if[$checkContains[$message;https://open.spotify.com/track/;https://open.spotify.com/playlist/]==true]
      $let[msg;$playTrack[spotify;$message]]
    $else
      $let[msg;$playTrack[youtube;$message]]
    $endif

    $onlyIf[$voiceId==$voiceId[$clientId];You're not in the same channel{delete:5s}]
    $if[$hasPlayer==false]
        $joinVc[$voiceId]
    $endif
    $onlyIf[$voiceId!=;You're not in a channel{delete:5s}]
    `
}
```

For the queue we can do something similar to the `embedUpdate` we did earlier and start like this:

```jsx
module.exports = {
	name: "queue",
	$if: "v4",
	code: `
    $if[$hasPlayer==true]
        
    $else
        
    $endif
    `
};
```

First we need to make an embed for when the queue is empty, like this:

```jsx
module.exports = {
	name: "queue",
	$if: "v4",
	code: `
    $if[$hasPlayer==true]
        
    $else
        $title[Queue empty. | $serverName]
        $thumbnail[$userAvatar[$clientId]]
        $description[There's no songs in the queue, use $getServerVar[prefix]play to add a song!]
        $footer[Page 1]
        $color[#e3b5d9]
    $endif
    `
};
```

After that we need to go to the real queue and check if the user wants to see a page in specific, like this:

```jsx
module.exports = {
	name: "queue",
	$if: "v4",
	code: `
    $if[$hasPlayer==true]
        $if[$message==]
            $let[page;1]
        $else    
            $let[page;$message[1]]
        $endif
    $else
        $title[Queue empty. | $serverName]
        $thumbnail[$userAvatar[$clientId]]
        $description[There's no songs in the queue, use $getServerVar[prefix]play to add a song!]
        $footer[Page 1]
        $color[#e3b5d9]
    $endif
    `
};
```

After that we have to check if the page selected exists like this:

```jsx
module.exports = {
	name: "queue",
	$if: "v4",
	code: `
    $if[$hasPlayer==true]
				$onlyIf[$queue[$get[page];15;{title}]!=;There's not that many pages!]
        $onlyIf[$get[page]>0;That's an invalid page number!{delete:5s}]
        $if[$message==]
            $let[page;1]
        $else    
            $let[page;$message[1]]
        $endif
    $else
        $title[Queue empty. | $serverName]
        $thumbnail[$userAvatar[$clientId]]
        $description[There's no songs in the queue, use $getServerVar[prefix]play to add a song!]
        $footer[Page 1]
        $color[#e3b5d9]
    $endif
    `
};
```

After that we can do something similar to the main embed, but this time, the JavaScript part will be a bit different, it’ll be like this:

```jsx
let s = 14 * (d.data.vars.page - 1);
let n = s + 14
d.data.array = d.data.array.filter(_ => _);
if (d.data.vars.page == 1) d.data.array.shift();
const msg = d.data.array.slice(s, n).map((str, i) => "[" + Math.floor(i + s + 2) + "]. " + str.replace(/\\n/g, "")).join("\\n") 
d.data.array.length > n * d.data.vars.page ? msg + "\\nAnd " + Math.floor(d.data.array.length - n) + " more..." : msg || "There's no more songs after this one! Add some:)";
```

Using that we make a custom embed, however you’d like it to look, in my case I’ll use this:

```jsx
module.exports = {
	name: "queue",
	$if: "v4",
	code: `
    $if[$hasPlayer==true]
        $title[Now playing: $songInfo[title] | $serverName]
        $description[
                $djsEval[
                        let s = 14 * (d.data.vars.page - 1);
                        let n = s + 14
                        d.data.array = d.data.array.filter(_ => _);
                        if (d.data.vars.page == 1) d.data.array.shift();
                        const msg = d.data.array.slice(s, n).map((str, i) => "[" + Math.floor(i + s + 2) + "]. " + str.replace(/\\n/g, "")).join("\\n") 
                        d.data.array.length > n * d.data.vars.page ? msg + "\\nAnd " + Math.floor(d.data.array.length - n) + " more..." : msg || "There's no more songs after this one! Add some:)";
                    ;yes]
        ]
        $footer[Page $get[page]]
        $color[#e3b5d9]
        $textSplit[$queue[$get[page];10000;{title}$clientId];$clientId]
        $onlyIf[$queue[$get[page];15;{title}]!=;There's not that many pages!]
        $onlyIf[$get[page]>0;That's an invalid page number!{delete:5s}]
        
        $if[$message==]
            $let[page;1]
        $else    
            $let[page;$message[1]]
        $endif
    $else
        $title[Queue empty. | $serverName]
        $thumbnail[$userAvatar[$clientId]]
        $description[There's no songs in the queue, use $getServerVar[prefix]play to add a song!]
        $footer[Page 1]
        $color[#e3b5d9]
    $endif
    `
};
```

And with that the bot would be done and completely working!

Thanks for watching the video and I hope it was helpful, if you have any suggestions please put it in the comments and I’ll be reading everything, also as an extra, I’m also doing a version of this but in Spanish, for all those people who can’t speak English very well:

Noticia para la gente de habla hispana, voy a hacer este mismo video pero en Español para aquellos que no saben demasiado de Inglés pero aún así quieran seguir el paso a paso, esperenlo pronto!